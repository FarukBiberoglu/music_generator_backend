"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicGenerationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const subscription_service_1 = require("../../subscription/service/subscription.service");
const sonauto_defaults_1 = require("../constants/sonauto-defaults");
const sonauto_client_1 = require("../sonauto.client");
let MusicGenerationService = class MusicGenerationService {
    constructor(sonautoClient, prismaService, subscriptionService) {
        this.sonautoClient = sonautoClient;
        this.prismaService = prismaService;
        this.subscriptionService = subscriptionService;
    }
    async addUserFavorite(firebaseUid, generationId) {
        const user = await this.findOrCreateUser(firebaseUid);
        const generation = await this.prismaService.musicGeneration.findUnique({
            where: { id: generationId },
            include: { songs: true },
        });
        if (!generation) {
            throw new common_1.NotFoundException('Generation not found');
        }
        if (generation.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only add your own generations to favorites');
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
    async deleteUserFavorite(firebaseUid, generationId) {
        const user = await this.findOrCreateUser(firebaseUid);
        const favorite = await this.prismaService.favorite.findUnique({
            where: {
                userId_generationId: { userId: user.id, generationId },
            },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Favorite not found');
        }
        await this.prismaService.favorite.delete({
            where: { id: favorite.id },
        });
    }
    async getUserFavorites(firebaseUid) {
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
    async getUserGeneration(firebaseUid) {
        const user = await this.findOrCreateUser(firebaseUid);
        return this.prismaService.musicGeneration.findMany({
            where: { userId: user.id },
            include: { songs: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getGenerationById(firebaseUid, generationId) {
        const user = await this.findOrCreateUser(firebaseUid);
        const generation = await this.prismaService.musicGeneration.findFirst({
            where: { id: generationId, userId: user.id },
            include: { songs: true },
        });
        if (!generation) {
            throw new common_1.NotFoundException('Generation not found');
        }
        return generation;
    }
    async deleteGeneration(firebaseUid, generationId) {
        const user = await this.findOrCreateUser(firebaseUid);
        const generation = await this.prismaService.musicGeneration.findFirst({
            where: { id: generationId, userId: user.id },
            select: { id: true },
        });
        if (!generation) {
            throw new common_1.NotFoundException('Generation not found');
        }
        await this.prismaService.$transaction(async (tx) => {
            await tx.favorite.deleteMany({ where: { generationId } });
            await tx.playlistItem.deleteMany({ where: { generationId } });
            await tx.song.deleteMany({ where: { generationId } });
            await tx.musicGeneration.delete({ where: { id: generationId } });
        });
    }
    async createGeneration(firebaseUid, dto) {
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
        }
        catch (error) {
            await this.subscriptionService.refundCredit(firebaseUid);
            const message = error instanceof Error ? error.message : 'Sonauto API error';
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
    async saveSongsAndCompleteGeneration(generationId, result) {
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
                    seed: result.data?.seed != null ? BigInt(result.data.seed) : undefined,
                    tags: result.data?.tags ?? undefined,
                    lyrics: result.data?.lyrics ?? undefined,
                },
            });
        });
    }
    normalizeAudioList(audio) {
        if (!audio)
            return [];
        return Array.isArray(audio) ? audio : [audio];
    }
    async findOrCreateUser(firebaseUid) {
        const existing = await this.prismaService.userModel.findUnique({
            where: { firebaseUid },
        });
        if (existing)
            return existing;
        try {
            return await this.prismaService.userModel.create({
                data: { firebaseUid },
            });
        }
        catch (e) {
            const isUniqueViolation = e &&
                typeof e === 'object' &&
                'code' in e &&
                e.code === 'P2002';
            if (isUniqueViolation) {
                return this.prismaService.userModel.findUniqueOrThrow({
                    where: { firebaseUid },
                });
            }
            throw e;
        }
    }
    buildSonautoPayload(dto) {
        const prompt = typeof dto.prompt === 'string'
            ? dto.prompt.trim() || undefined
            : undefined;
        const lyrics = typeof dto.lyrics === 'string'
            ? dto.lyrics.trim() || undefined
            : undefined;
        const tags = Array.isArray(dto.tags) && dto.tags.length > 0 ? dto.tags : undefined;
        return {
            ...sonauto_defaults_1.SONAUTO_DEFAULTS,
            num_songs: dto.num_songs ?? sonauto_defaults_1.SONAUTO_DEFAULTS.num_songs,
            ...(prompt && { prompt }),
            ...(lyrics && { lyrics_prompt: lyrics }),
            ...(tags && { tags }),
            ...(dto.seed != null && { seed: dto.seed }),
        };
    }
};
exports.MusicGenerationService = MusicGenerationService;
exports.MusicGenerationService = MusicGenerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sonauto_client_1.SonautoClient,
        prisma_service_1.PrismaService,
        subscription_service_1.SubscriptionService])
], MusicGenerationService);
//# sourceMappingURL=music.service.js.map