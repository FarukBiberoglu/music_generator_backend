import { Module } from '@nestjs/common';
import { PlaylistService } from '../service/plalylist.service';
import { PlaylistController } from '../controller/playlist.controller';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
