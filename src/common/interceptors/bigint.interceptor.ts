import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function bigintReplacer(_key: string, value: unknown) {
  return typeof value === 'bigint' ? value.toString() : value;
}

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => JSON.parse(JSON.stringify(data, bigintReplacer)))
    );
  }
}
