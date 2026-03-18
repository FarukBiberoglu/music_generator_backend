"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalHttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalHttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalHttpExceptionFilter = GlobalHttpExceptionFilter_1 = class GlobalHttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GlobalHttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const { status, message } = this.normalize(exception);
        if (status >= 500) {
            this.logger.error(`${request.method} ${request.url} ${status} - ${message}`, exception instanceof Error ? exception.stack : undefined);
        }
        const body = {
            success: false,
            message,
            code: status,
            path: request.url,
        };
        response.status(status).json(body);
    }
    normalize(exception) {
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            const message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : exceptionResponse?.message;
            return {
                status,
                message: Array.isArray(message)
                    ? message[0]
                    : (message ?? exception.message),
            };
        }
        if (exception instanceof Error) {
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An unexpected error occurred.',
            };
        }
        return {
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred.',
        };
    }
};
exports.GlobalHttpExceptionFilter = GlobalHttpExceptionFilter;
exports.GlobalHttpExceptionFilter = GlobalHttpExceptionFilter = GlobalHttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalHttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map