import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface SonautoFalInput {
    prompt?: string;
    tags?: string[];
    lyrics_prompt?: string;
    seed?: number;
    prompt_strength?: number;
    balance_strength?: number;
    num_songs?: number;
    output_format?: 'flac' | 'mp3' | 'wav' | 'ogg' | 'm4a';
    bpm?: number | 'auto';
}
export interface SonautoFalAudioItem {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
}
export interface SonautoFalResult {
    data?: {
        audio?: SonautoFalAudioItem | SonautoFalAudioItem[];
        seed?: number;
        tags?: string[];
        lyrics?: string;
    };
    requestId?: string;
}
export declare class SonautoClient implements OnModuleInit {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    onModuleInit(): void;
    generate(input: SonautoFalInput): Promise<SonautoFalResult>;
}
