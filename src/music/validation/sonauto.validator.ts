import { ALLOWED_TAGS, isAllowedTag } from '../constants/allowed-tags';
import { GenerateMusicDto } from '../dto/generate-music.dto';

export type SonautoValidationResult =
  | { valid: true }
  | { valid: false; message: string };

const MESSAGES = {
  NONE: 'At least one of prompt, tags or lyrics is required.',
  LYRICS_ALONE:
    'Lyrics cannot be used alone. You must provide prompt or tags together with lyrics.',
  TAGS_ALONE:
    'Tags cannot be used alone. You must provide prompt (AI writes lyrics) or your own lyrics together with tags.',
  ALL_THREE:
    'Prompt, tags and lyrics cannot all be used together. Choose two: prompt+tags, prompt+lyrics, or tags+lyrics.',
  INVALID_TAGS: `Only the following tags are allowed: ${ALLOWED_TAGS.join(', ')}.`,
} as const;

export function validateSonautoInput(
  dto: GenerateMusicDto | null | undefined,
): SonautoValidationResult {
  if (!dto || typeof dto !== 'object') {
    return { valid: false, message: MESSAGES.NONE };
  }

  const prompt = typeof dto.prompt === 'string' ? dto.prompt.trim() : '';
  const tags =
    Array.isArray(dto.tags) && dto.tags.length > 0 ? dto.tags : undefined;
  const lyrics = typeof dto.lyrics === 'string' ? dto.lyrics.trim() : '';

  const hasPrompt = prompt.length > 0;
  const hasTags = !!tags;
  const hasLyrics = lyrics.length > 0;

  if (hasTags && tags) {
    const invalid = tags.filter(
      (t) => typeof t !== 'string' || !isAllowedTag(String(t).trim()),
    );
    if (invalid.length > 0) {
      return { valid: false, message: MESSAGES.INVALID_TAGS };
    }
  }

  if (!hasPrompt && !hasTags && !hasLyrics) {
    return { valid: false, message: MESSAGES.NONE };
  }

  if (hasLyrics && !hasPrompt && !hasTags) {
    return { valid: false, message: MESSAGES.LYRICS_ALONE };
  }

  if (hasTags && !hasPrompt && !hasLyrics) {
    return { valid: false, message: MESSAGES.TAGS_ALONE };
  }

  if (hasPrompt && hasTags && hasLyrics) {
    return { valid: false, message: MESSAGES.ALL_THREE };
  }

  return { valid: true };
}
