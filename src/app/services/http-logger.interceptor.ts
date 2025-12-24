import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggerInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Log request summary
    console.log('[HTTP] →', req.method, req.urlWithParams, req.headers.keys().length ? req.headers : '');

    return next.handle(req).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            console.log('[HTTP] ←', event.status, req.method, req.urlWithParams, event.body);
          }
        },
        error: (err: any) => {
          console.error('[HTTP] !!!', req.method, req.urlWithParams, 'status=', err?.status, 'body=', err?.error ?? err?.message ?? err);
        }
      })
    );
  }
}