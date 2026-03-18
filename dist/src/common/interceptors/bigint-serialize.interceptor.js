"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntSerializeInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
function serializeBigInt(value) {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    if (Array.isArray(value)) {
        return value.map((item) => serializeBigInt(item));
    }
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serializeBigInt(v)]));
    }
    return value;
}
let BigIntSerializeInterceptor = class BigIntSerializeInterceptor {
    intercept(_context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => serializeBigInt(data)));
    }
};
exports.BigIntSerializeInterceptor = BigIntSerializeInterceptor;
exports.BigIntSerializeInterceptor = BigIntSerializeInterceptor = __decorate([
    (0, common_1.Injectable)()
], BigIntSerializeInterceptor);
//# sourceMappingURL=bigint-serialize.interceptor.js.map