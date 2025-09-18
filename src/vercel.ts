import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';

let cached: any;

export default async function handler(req: any, res: any) {
  if (!cached) {
    const server = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      logger: ['error','warn','log'],
    });
    app.enableCors({ origin: true, credentials: true });
    await app.init();
    cached = serverless(server); // cache entre invocaciones
  }
  return cached(req, res);
}
