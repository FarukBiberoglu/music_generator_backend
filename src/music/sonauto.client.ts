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
  private isFalConfigured = false;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const key =
      this.config.get<string>('FAL_KEY') ??
      this.config.get<string>('FAL_API_KEY');
    if (!key) {
      this.logger.warn(
        'FAL_KEY/FAL_API_KEY is not set. Music generation endpoints will return an error until configured.',
      );
      return;
    }
    fal.config({ credentials: key });
    this.isFalConfigured = true;
  }

  async generate(input: SonautoFalInput): Promise<SonautoFalResult> {
    if (!this.isFalConfigured) {
      throw new Error(
        'Music generation is not configured. Set FAL_KEY or FAL_API_KEY.',
      );
    }

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
