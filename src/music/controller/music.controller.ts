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
import { FirebaseAuthGuard } from '../../firebase/guards/firebase_auth_guard';
import { CurrentUser } from '../../firebase/decorators/current-user.decorator';
import { ALLOWED_TAGS } from '../constants/allowed-tags';
import { GenerateMusicDto } from '../dto/generate-music.dto';
import { ValidateSonautoPipe } from '../pipes/validate-sonauto.pipe';
import { MusicGenerationService } from '../service/music.service';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicGenerationService) {}

  @Get('tags')
  getTags(): string[] {
    return [...ALLOWED_TAGS];
  }

  @Post('generate')
  @UseGuards(FirebaseAuthGuard)
  async generateMusic(
    @CurrentUser() user: { uid: string },
    @Body(ValidateSonautoPipe) dto: GenerateMusicDto,
  ) {
    return this.musicService.createGeneration(user.uid, dto);
  }

  @Get('generations')
  @UseGuards(FirebaseAuthGuard)
  async getMyGeneration(@CurrentUser() user: { uid: string }) {
    return this.musicService.getUserGeneration(user.uid);
  }

  @Get('generations/:id')
  @UseGuards(FirebaseAuthGuard)
  async getGenerationById(
    @CurrentUser() user: { uid: string },
    @Param('id') generationId: string,
  ) {
    return this.musicService.getGenerationById(user.uid, generationId);
  }

  @Delete('generations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async deleteGeneration(
    @CurrentUser() user: { uid: string },
    @Param('id') generationId: string,
  ) {
    await this.musicService.deleteGeneration(user.uid, generationId);
  }

  @Post('generations/:id/favorite')
  @UseGuards(FirebaseAuthGuard)
  async addFavorite(
    @CurrentUser() user: { uid: string },
    @Param('id') generationId: string,
  ) {
    return this.musicService.addUserFavorite(user.uid, generationId);
  }

  @Get('favorites')
  @UseGuards(FirebaseAuthGuard)
  async getMyFavorites(@CurrentUser() user: { uid: string }) {
    return this.musicService.getUserFavorites(user.uid);
  }

  @Delete('favorites/:generationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async deleteMyFavorite(
    @CurrentUser() user: { uid: string },
    @Param('generationId') generationId: string,
  ) {
    await this.musicService.deleteUserFavorite(user.uid, generationId);
  }
}
