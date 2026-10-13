import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AdminSession } from './admin-session.service';
import { safeReturnUrl } from './return-url';

const HANDLED_HERE = ['/api/v1/admin/auth/', '/api/v1/admin/session'];

export const sessionExpiredInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(AdminSession);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      const handledHere = HANDLED_HERE.some((prefix) => request.url.startsWith(prefix));

      if (error instanceof HttpErrorResponse && error.status === 401 && !handledHere && session.signedIn()) {
        session.expire();
        const back = safeReturnUrl(router.url);
        void router.navigate(['/entrar'], {
          queryParams: back === '/' ? { motivo: 'sessao' } : { motivo: 'sessao', voltar: back },
        });
      }

      return throwError(() => error);
    }),
  );
};
