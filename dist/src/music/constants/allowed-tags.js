"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_TAGS = void 0;
exports.isAllowedTag = isAllowedTag;
exports.ALLOWED_TAGS = [
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
];
function isAllowedTag(value) {
    return exports.ALLOWED_TAGS.includes(value);
}
//# sourceMappingURL=allowed-tags.js.map