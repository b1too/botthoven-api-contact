import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BigIntInterceptor } from './common/interceptors/bigint.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new BigIntInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: true, credentials: true });
  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 Botthoven Contact listening on http://localhost:${port}`);
}
bootstrap();
