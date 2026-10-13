import { HttpInterceptorFn } from '@angular/common/http';

export const CSRF_HEADER = 'X-Brasa-Csrf';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const csrfInterceptor: HttpInterceptorFn = (request, next) => {
  if (SAFE_METHODS.has(request.method) || !request.url.startsWith('/api/')) {
    return next(request);
  }

  return next(request.clone({ setHeaders: { [CSRF_HEADER]: '1' } }));
};
