export const ALLOWED_TAGS = [
  'pop',
  'rap',
  'hip hop',
  'punk',
  'jazz',
  'rock',
  'acoustic',
  'trap',
  'chill',
  'emotional',
] as const;

export type AllowedTag = (typeof ALLOWED_TAGS)[number];

export function isAllowedTag(value: string): value is AllowedTag {
  return ALLOWED_TAGS.includes(value as AllowedTag);
}
