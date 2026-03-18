import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fal } from '@fal-ai/client';

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

const FAL_MODEL = 'sonauto/v2/text-to-music';

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

@Injectable()
export class SonautoClient implements OnModuleInit {
  private readonly logger = new Logger(SonautoClient.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const key =
      this.config.get<string>('FAL_KEY') ??
      this.config.get<string>('FAL_API_KEY');
    if (!key) {
      throw new Error('FAL_KEY or FAL_API_KEY is required');
    }
    fal.config({ credentials: key });
  }

  async generate(input: SonautoFalInput): Promise<SonautoFalResult> {
    let loggedCount = 0;

    const result = await fal.subscribe(FAL_MODEL, {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS' && update.logs) {
          const newLogs = update.logs.slice(loggedCount);
          newLogs
            .map((log) => log.message)
            .forEach((msg) => this.logger.debug(msg));
          loggedCount = update.logs.length;
        }
      },
    });
    return result;
  }
}
