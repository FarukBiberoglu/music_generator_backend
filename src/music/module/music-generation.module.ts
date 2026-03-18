import { Module } from '@nestjs/common';
import { MusicController } from '../controller/music.controller';
import { MusicGenerationService } from '../service/music.service';
import { SonautoClient } from '../sonauto.client';
import { SubscriptionModule } from '../../subscription/module/subscription.module';

@Module({
  imports: [SubscriptionModule],
  controllers: [MusicController],
  providers: [MusicGenerationService, SonautoClient],
  exports: [MusicGenerationService],
})
export class MusicGenerationModule {}
