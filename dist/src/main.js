"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const bigint_serialize_interceptor_1 = require("./common/interceptors/bigint-serialize.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigin = process.env.CORS_ORIGIN;
    app.enableCors(allowedOrigin
        ? { origin: allowedOrigin.split(',').map((o) => o.trim()) }
        : { origin: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalHttpExceptionFilter());
    app.useGlobalInterceptors(new bigint_serialize_interceptor_1.BigIntSerializeInterceptor());
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map