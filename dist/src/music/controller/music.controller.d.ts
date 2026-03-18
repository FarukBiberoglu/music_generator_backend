import { GenerateMusicDto } from '../dto/generate-music.dto';
import { MusicGenerationService } from '../service/music.service';
export declare class MusicController {
    private readonly musicService;
    constructor(musicService: MusicGenerationService);
    getTags(): string[];
    generateMusic(user: {
        uid: string;
    }, dto: GenerateMusicDto): Promise<{
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
    getMyGeneration(user: {
        uid: string;
    }): Promise<({
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
    getGenerationById(user: {
        uid: string;
    }, generationId: string): Promise<{
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
    deleteGeneration(user: {
        uid: string;
    }, generationId: string): Promise<void>;
    addFavorite(user: {
        uid: string;
    }, generationId: string): Promise<{
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
    getMyFavorites(user: {
        uid: string;
    }): Promise<({
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
    deleteMyFavorite(user: {
        uid: string;
    }, generationId: string): Promise<void>;
}
