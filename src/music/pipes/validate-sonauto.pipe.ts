import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { GenerateMusicDto } from '../dto/generate-music.dto';
import { validateSonautoInput } from '../validation/sonauto.validator';

@Injectable()
export class ValidateSonautoPipe implements PipeTransform<GenerateMusicDto> {
  transform(value: GenerateMusicDto): GenerateMusicDto {
    const result = validateSonautoInput(value);
    if (!result.valid) {
      throw new BadRequestException(result.message);
    }
    return value;
  }
}
