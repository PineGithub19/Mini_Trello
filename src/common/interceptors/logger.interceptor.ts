import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LogstashService } from '../../logstash/logstash.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logstashService: LogstashService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const { method, url, body, query, params, user } = req;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = ctx.getResponse();
        const statusCode = res.statusCode;
        const duration = Date.now() - startTime;

        const logData = {
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          user: user ? user.sub || user.email || 'authenticated' : 'anonymous',
          body,
          query,
          params,
        };

        if (statusCode >= 500) {
          this.logstashService.error(`Request failed: ${method} ${url}`, undefined, logData);
        } else if (statusCode >= 400) {
          this.logstashService.warn(`Request warning: ${method} ${url}`, logData);
        } else {
          this.logstashService.info(`Request success: ${method} ${url}`, logData);
        }
      }),
      catchError((err) => {
        const duration = Date.now() - startTime;
        const statusCode = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const logData = {
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          user: user ? user.sub || user.email || 'authenticated' : 'anonymous',
          body,
          query,
          params,
          error: err.message,
        };

        if (statusCode >= 500) {
          this.logstashService.error(`Request Error: ${method} ${url}`, err.stack, logData);
        } else {
          this.logstashService.warn(`Request Warning: ${method} ${url}`, logData);
        }

        return throwError(() => err);
      }),
    );
  }
}
