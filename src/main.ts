import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { BigIntSerializeInterceptor } from './common/interceptors/bigint-serialize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigin = process.env.CORS_ORIGIN;
  app.enableCors(
    allowedOrigin
      ? { origin: allowedOrigin.split(',').map((o) => o.trim()) }
      : { origin: true },
  );

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }),
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new BigIntSerializeInterceptor());
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
