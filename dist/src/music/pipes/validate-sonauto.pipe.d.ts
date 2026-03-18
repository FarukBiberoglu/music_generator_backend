import { PipeTransform } from '@nestjs/common';
import { GenerateMusicDto } from '../dto/generate-music.dto';
export declare class ValidateSonautoPipe implements PipeTransform<GenerateMusicDto> {
    transform(value: GenerateMusicDto): GenerateMusicDto;
}
