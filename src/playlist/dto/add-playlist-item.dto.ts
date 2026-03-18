import { IsNotEmpty, IsString } from 'class-validator';

export class AddPlaylistItemDto {
  @IsString()
  @IsNotEmpty()
  generationId: string;
}
