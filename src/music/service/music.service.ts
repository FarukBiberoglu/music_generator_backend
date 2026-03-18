import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionService } from '../../subscription/service/subscription.service';
import { SONAUTO_DEFAULTS } from '../constants/sonauto-defaults';
import { GenerateMusicDto } from '../dto/generate-music.dto';
import {
  SonautoClient,
  SonautoFalAudioItem,
  SonautoFalResult,
} from '../sonauto.client';

@Injectable()
export class MusicGenerationService {
  constructor(
    private readonly sonautoClient: SonautoClient,
    private readonly prismaService: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async addUserFavorite(firebaseUid: string, generationId: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    const generation = await this.prismaService.musicGeneration.findUnique({
      where: { id: generationId },
      include: { songs: true },
    });
    if (!generation) {
      throw new NotFoundException('Generation not found');
    }
    if (generation.userId !== user.id) {
      throw new ForbiddenException(
        'You can only add your own generations to favorites',
      );
    }
    await this.prismaService.favorite.upsert({
      where: {
        userId_generationId: { userId: user.id, generationId },
      },
      create: { userId: user.id, generationId },
      update: {},
    });
    return generation;
  }

  async deleteUserFavorite(firebaseUid: string, generationId: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    const favorite = await this.prismaService.favorite.findUnique({
      where: {
        userId_generationId: { userId: user.id, generationId },
      },
    });
    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }
    await this.prismaService.favorite.delete({
      where: { id: favorite.id },
    });
  }

  async getUserFavorites(firebaseUid: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    const favorites = await this.prismaService.favorite.findMany({
      where: { userId: user.id },
      include: {
        generation: { include: { songs: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return favorites.map((f) => f.generation);
  }

  async getUserGeneration(firebaseUid: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    return this.prismaService.musicGeneration.findMany({
      where: { userId: user.id },
      include: { songs: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGenerationById(firebaseUid: string, generationId: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    const generation = await this.prismaService.musicGeneration.findFirst({
      where: { id: generationId, userId: user.id },
      include: { songs: true },
    });
    if (!generation) {
      throw new NotFoundException('Generation not found');
    }
    return generation;
  }

  async deleteGeneration(firebaseUid: string, generationId: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    const generation = await this.prismaService.musicGeneration.findFirst({
      where: { id: generationId, userId: user.id },
      select: { id: true },
    });
    if (!generation) {
      throw new NotFoundException('Generation not found');
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.favorite.deleteMany({ where: { generationId } });
      await tx.playlistItem.deleteMany({ where: { generationId } });
      await tx.song.deleteMany({ where: { generationId } });
      await tx.musicGeneration.delete({ where: { id: generationId } });
    });
  }

  async createGeneration(firebaseUid: string, dto: GenerateMusicDto) {
    await this.subscriptionService.consumeCredit(firebaseUid);
    const user = await this.findOrCreateUser(firebaseUid);
    const generation = await this.prismaService.musicGeneration.create({
      data: {
        userId: user.id,
        prompt: dto.prompt,
        lyrics: dto.lyrics,
        tags: dto.tags ?? [],
        seed: dto.seed != null ? BigInt(dto.seed) : null,
        status: 'PENDING',
      },
    });

    const payload = this.buildSonautoPayload(dto);

    try {
      const result = await this.sonautoClient.generate(payload);
      await this.saveSongsAndCompleteGeneration(generation.id, result);
      return this.prismaService.musicGeneration.findUniqueOrThrow({
        where: { id: generation.id },
        include: { songs: true },
      });
    } catch (error) {
      await this.subscriptionService.refundCredit(firebaseUid);
      const message =
        error instanceof Error ? error.message : 'Sonauto API error';
      await this.prismaService.musicGeneration.update({
        where: { id: generation.id },
        data: { status: 'FAILED', errorMessage: message },
      });
      return this.prismaService.musicGeneration.findUniqueOrThrow({
        where: { id: generation.id },
        include: { songs: true },
      });
    }
  }

  private async saveSongsAndCompleteGeneration(
    generationId: string,
    result: SonautoFalResult,
  ) {
    const audioItems = this.normalizeAudioList(result.data?.audio);
    if (audioItems.length === 0) {
      throw new Error('No audio in Fal API result');
    }

    const defaultContentType = 'audio/wav';
    const songsData = audioItems.map((item) => ({
      generationId,
      audioUrl: item.url,
      contentType: item.content_type ?? defaultContentType,
      fileName: item.file_name ?? undefined,
      fileSize: item.file_size ?? undefined,
    }));

    await this.prismaService.$transaction(async (tx) => {
      await tx.song.createMany({ data: songsData });
      await tx.musicGeneration.update({
        where: { id: generationId },
        data: {
          status: 'COMPLETED',
          seed:
            result.data?.seed != null ? BigInt(result.data.seed) : undefined,
          tags: result.data?.tags ?? undefined,
          lyrics: result.data?.lyrics ?? undefined,
        },
      });
    });
  }

  private normalizeAudioList(
    audio: SonautoFalAudioItem | SonautoFalAudioItem[] | undefined,
  ): SonautoFalAudioItem[] {
    if (!audio) return [];
    return Array.isArray(audio) ? audio : [audio];
  }

  private async findOrCreateUser(firebaseUid: string) {
    const existing = await this.prismaService.userModel.findUnique({
      where: { firebaseUid },
    });
    if (existing) return existing;

    try {
      return await this.prismaService.userModel.create({
        data: { firebaseUid },
      });
    } catch (e: unknown) {
      const isUniqueViolation =
        e &&
        typeof e === 'object' &&
        'code' in e &&
        (e as { code: string }).code === 'P2002';
      if (isUniqueViolation) {
        return this.prismaService.userModel.findUniqueOrThrow({
          where: { firebaseUid },
        });
      }
      throw e;
    }
  }

  private buildSonautoPayload(dto: GenerateMusicDto) {
    const prompt =
      typeof dto.prompt === 'string'
        ? dto.prompt.trim() || undefined
        : undefined;
    const lyrics =
      typeof dto.lyrics === 'string'
        ? dto.lyrics.trim() || undefined
        : undefined;
    const tags =
      Array.isArray(dto.tags) && dto.tags.length > 0 ? dto.tags : undefined;

    return {
      ...SONAUTO_DEFAULTS,
      num_songs: dto.num_songs ?? SONAUTO_DEFAULTS.num_songs,
      ...(prompt && { prompt }),
      ...(lyrics && { lyrics_prompt: lyrics }),
      ...(tags && { tags }),
      ...(dto.seed != null && { seed: dto.seed }),
    };
  }
}
