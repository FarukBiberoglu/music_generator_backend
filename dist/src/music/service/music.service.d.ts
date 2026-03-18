import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionService } from '../../subscription/service/subscription.service';
import { GenerateMusicDto } from '../dto/generate-music.dto';
import { SonautoClient } from '../sonauto.client';
export declare class MusicGenerationService {
    private readonly sonautoClient;
    private readonly prismaService;
    private readonly subscriptionService;
    constructor(sonautoClient: SonautoClient, prismaService: PrismaService, subscriptionService: SubscriptionService);
    addUserFavorite(firebaseUid: string, generationId: string): Promise<{
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
    }>;
    deleteUserFavorite(firebaseUid: string, generationId: string): Promise<void>;
    getUserFavorites(firebaseUid: string): Promise<({
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
    })[]>;
    getUserGeneration(firebaseUid: string): Promise<({
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
    })[]>;
    getGenerationById(firebaseUid: string, generationId: string): Promise<{
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
    }>;
    deleteGeneration(firebaseUid: string, generationId: string): Promise<void>;
    createGeneration(firebaseUid: string, dto: GenerateMusicDto): Promise<{
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
    }>;
    private saveSongsAndCompleteGeneration;
    private normalizeAudioList;
    private findOrCreateUser;
    private buildSonautoPayload;
}
