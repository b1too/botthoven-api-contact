import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validApiKey = process.env.API_KEY;

  canActivate(context: ExecutionContext): boolean {
    if (!this.validApiKey) {
      throw new Error('API_KEY not configured');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== this.validApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
