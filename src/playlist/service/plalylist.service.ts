import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { AddPlaylistItemDto } from '../dto/add-playlist-item.dto';

@Injectable()
export class PlaylistService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(firebaseUid: string, dto: CreatePlaylistDto) {
    const user = await this.findOrCreateUser(firebaseUid);
    return this.prismaService.playlist.create({
      data: {
        userId: user.id,
        name: dto.name.trim(),
      },
    });
  }

  async findMyPlaylists(firebaseUid: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    return this.prismaService.playlist.findMany({
      where: { userId: user.id },
      include: {
        items: { orderBy: { position: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(firebaseUid: string, playlistId: string) {
    const user = await this.findOrCreateUser(firebaseUid);
    const playlist = await this.prismaService.playlist.findUnique({
      where: { id: playlistId },
      include: {
        items: {
          orderBy: { position: 'asc' },
          include: {
            generation: { include: { songs: true } },
          },
        },
      },
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== user.id) {
      throw new ForbiddenException('You can only view your own playlists');
    }
    return playlist;
  }

  async addItem(
    firebaseUid: string,
    playlistId: string,
    dto: AddPlaylistItemDto,
  ) {
    const user = await this.findOrCreateUser(firebaseUid);

    const playlist = await this.prismaService.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== user.id) {
      throw new ForbiddenException(
        'You can only add items to your own playlists',
      );
    }

    const generation = await this.prismaService.musicGeneration.findUnique({
      where: { id: dto.generationId },
    });
    if (!generation) {
      throw new NotFoundException('Generation not found');
    }
    if (generation.userId !== user.id) {
      throw new ForbiddenException(
        'You can only add your own generations to playlists',
      );
    }

    const lastItem = await this.prismaService.playlistItem.findFirst({
      where: { playlistId },
      orderBy: { position: 'desc' },
    });
    const nextPosition = lastItem == null ? 0 : lastItem.position + 1;

    try {
      await this.prismaService.playlistItem.create({
        data: {
          playlistId,
          generationId: dto.generationId,
          position: nextPosition,
        },
      });
    } catch (e: unknown) {
      const isUniqueViolation =
        e &&
        typeof e === 'object' &&
        'code' in e &&
        (e as { code: string }).code === 'P2002';
      if (isUniqueViolation) {
        throw new ConflictException(
          'This generation is already in the playlist',
        );
      }
      throw e;
    }

    return this.findOne(firebaseUid, playlistId);
  }

  async removeItem(
    firebaseUid: string,
    playlistId: string,
    itemId: string,
  ): Promise<void> {
    const user = await this.findOrCreateUser(firebaseUid);

    const item = await this.prismaService.playlistItem.findFirst({
      where: { id: itemId, playlistId },
      include: { playlist: true },
    });
    if (!item) {
      throw new NotFoundException('Playlist item not found');
    }
    if (item.playlist.userId !== user.id) {
      throw new ForbiddenException(
        'You can only remove items from your own playlists',
      );
    }

    await this.prismaService.playlistItem.delete({
      where: { id: itemId },
    });
  }

  async deletePlaylist(firebaseUid: string, playlistId: string): Promise<void> {
    const user = await this.findOrCreateUser(firebaseUid);

    const playlist = await this.prismaService.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own playlists');
    }

    await this.prismaService.playlist.delete({
      where: { id: playlistId },
    });
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
}
