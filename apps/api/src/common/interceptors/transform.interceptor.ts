import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * Wraps successful responses in a standard envelope:
 *   { data: ..., timestamp: ... }
 *
 * Pagination responses (those already containing { data, pagination })
 * are passed through without double-wrapping.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responseData) => {
        // If the controller already returned a paginated structure, pass it through
        if (
          responseData &&
          typeof responseData === 'object' &&
          'pagination' in responseData
        ) {
          return {
            ...responseData,
            timestamp: new Date().toISOString(),
          };
        }

        // Health check responses — pass through
        if (
          responseData &&
          typeof responseData === 'object' &&
          'status' in responseData &&
          ('details' in responseData || 'info' in responseData)
        ) {
          return responseData;
        }

        return {
          data: responseData,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
