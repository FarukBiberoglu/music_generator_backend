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
exports.PlaylistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PlaylistService = class PlaylistService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(firebaseUid, dto) {
        const user = await this.findOrCreateUser(firebaseUid);
        return this.prismaService.playlist.create({
            data: {
                userId: user.id,
                name: dto.name.trim(),
            },
        });
    }
    async findMyPlaylists(firebaseUid) {
        const user = await this.findOrCreateUser(firebaseUid);
        return this.prismaService.playlist.findMany({
            where: { userId: user.id },
            include: {
                items: { orderBy: { position: 'asc' } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findOne(firebaseUid, playlistId) {
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
            throw new common_1.NotFoundException('Playlist not found');
        }
        if (playlist.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only view your own playlists');
        }
        return playlist;
    }
    async addItem(firebaseUid, playlistId, dto) {
        const user = await this.findOrCreateUser(firebaseUid);
        const playlist = await this.prismaService.playlist.findUnique({
            where: { id: playlistId },
        });
        if (!playlist) {
            throw new common_1.NotFoundException('Playlist not found');
        }
        if (playlist.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only add items to your own playlists');
        }
        const generation = await this.prismaService.musicGeneration.findUnique({
            where: { id: dto.generationId },
        });
        if (!generation) {
            throw new common_1.NotFoundException('Generation not found');
        }
        if (generation.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only add your own generations to playlists');
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
        }
        catch (e) {
            const isUniqueViolation = e &&
                typeof e === 'object' &&
                'code' in e &&
                e.code === 'P2002';
            if (isUniqueViolation) {
                throw new common_1.ConflictException('This generation is already in the playlist');
            }
            throw e;
        }
        return this.findOne(firebaseUid, playlistId);
    }
    async removeItem(firebaseUid, playlistId, itemId) {
        const user = await this.findOrCreateUser(firebaseUid);
        const item = await this.prismaService.playlistItem.findFirst({
            where: { id: itemId, playlistId },
            include: { playlist: true },
        });
        if (!item) {
            throw new common_1.NotFoundException('Playlist item not found');
        }
        if (item.playlist.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only remove items from your own playlists');
        }
        await this.prismaService.playlistItem.delete({
            where: { id: itemId },
        });
    }
    async deletePlaylist(firebaseUid, playlistId) {
        const user = await this.findOrCreateUser(firebaseUid);
        const playlist = await this.prismaService.playlist.findUnique({
            where: { id: playlistId },
        });
        if (!playlist) {
            throw new common_1.NotFoundException('Playlist not found');
        }
        if (playlist.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only delete your own playlists');
        }
        await this.prismaService.playlist.delete({
            where: { id: playlistId },
        });
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
};
exports.PlaylistService = PlaylistService;
exports.PlaylistService = PlaylistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlaylistService);
//# sourceMappingURL=plalylist.service.js.map