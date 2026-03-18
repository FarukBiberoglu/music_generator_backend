import { GenerateMusicDto } from '../dto/generate-music.dto';
export type SonautoValidationResult = {
    valid: true;
} | {
    valid: false;
    message: string;
};
export declare function validateSonautoInput(dto: GenerateMusicDto | null | undefined): SonautoValidationResult;
