export declare const ALLOWED_TAGS: readonly ["pop", "rap", "hip hop", "punk", "jazz", "rock", "acoustic", "trap", "chill", "emotional"];
export type AllowedTag = (typeof ALLOWED_TAGS)[number];
export declare function isAllowedTag(value: string): value is AllowedTag;
