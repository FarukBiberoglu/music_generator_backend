import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { AddPlaylistItemDto } from '../dto/add-playlist-item.dto';
export declare class PlaylistService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    create(firebaseUid: string, dto: CreatePlaylistDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        updatedAt: Date;
    }>;
    findMyPlaylists(firebaseUid: string): Promise<({
        items: {
            id: string;
            createdAt: Date;
            generationId: string;
            position: number;
            playlistId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        updatedAt: Date;
    })[]>;
    findOne(firebaseUid: string, playlistId: string): Promise<{
        items: ({
            generation: {
                songs: {
                    id: string;
                    createdAt: Date;
                    generationId: string;
                    audioUrl: string;
                    contentType: string;
                    fileName: string | null;
                    fileSize: number | null;
                    durationSec: number | null;
                }[];
            } & {
                seed: bigint | null;
                status: import("@prisma/client").$Enums.GenerationStatus;
                prompt: string | null;
                tags: string[];
                lyrics: string | null;
                id: string;
                createdAt: Date;
                userId: string;
                errorMessage: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            generationId: string;
            position: number;
            playlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        updatedAt: Date;
    }>;
    addItem(firebaseUid: string, playlistId: string, dto: AddPlaylistItemDto): Promise<{
        items: ({
            generation: {
                songs: {
                    id: string;
                    createdAt: Date;
                    generationId: string;
                    audioUrl: string;
                    contentType: string;
                    fileName: string | null;
                    fileSize: number | null;
                    durationSec: number | null;
                }[];
            } & {
                seed: bigint | null;
                status: import("@prisma/client").$Enums.GenerationStatus;
                prompt: string | null;
                tags: string[];
                lyrics: string | null;
                id: string;
                createdAt: Date;
                userId: string;
                errorMessage: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            generationId: string;
            position: number;
            playlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        updatedAt: Date;
    }>;
    removeItem(firebaseUid: string, playlistId: string, itemId: string): Promise<void>;
    deletePlaylist(firebaseUid: string, playlistId: string): Promise<void>;
    private findOrCreateUser;
}
