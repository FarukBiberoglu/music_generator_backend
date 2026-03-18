import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class GenerateMusicDto {
  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  lyrics?: string;

  @IsOptional()
  @IsNumber()
  seed?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  num_songs?: number;
}
