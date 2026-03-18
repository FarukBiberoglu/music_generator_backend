import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from '../service/plalylist.service';
import { FirebaseAuthGuard } from '../../firebase/guards/firebase_auth_guard';
import { CurrentUser } from '../../firebase/decorators/current-user.decorator';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { AddPlaylistItemDto } from '../dto/add-playlist-item.dto';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async create(
    @CurrentUser() user: { uid: string },
    @Body() dto: CreatePlaylistDto,
  ) {
    return this.playlistService.create(user.uid, dto);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async findMyPlaylists(@CurrentUser() user: { uid: string }) {
    return this.playlistService.findMyPlaylists(user.uid);
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  async findOne(
    @CurrentUser() user: { uid: string },
    @Param('id') playlistId: string,
  ) {
    return this.playlistService.findOne(user.uid, playlistId);
  }

  @Post(':id/items')
  @UseGuards(FirebaseAuthGuard)
  async addItem(
    @CurrentUser() user: { uid: string },
    @Param('id') playlistId: string,
    @Body() dto: AddPlaylistItemDto,
  ) {
    return this.playlistService.addItem(user.uid, playlistId, dto);
  }

  @Delete(':id/items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async removeItem(
    @CurrentUser() user: { uid: string },
    @Param('id') playlistId: string,
    @Param('itemId') itemId: string,
  ) {
    await this.playlistService.removeItem(user.uid, playlistId, itemId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async deletePlaylist(
    @CurrentUser() user: { uid: string },
    @Param('id') playlistId: string,
  ) {
    await this.playlistService.deletePlaylist(user.uid, playlistId);
  }
}
