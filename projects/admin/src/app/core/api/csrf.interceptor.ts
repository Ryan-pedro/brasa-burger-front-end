import { HttpInterceptorFn } from '@angular/common/http';

/** Cabeçalho exigido pela API em toda requisição que altera estado (veja CsrfHeaderFilter). */
export const CSRF_HEADER = 'X-Brasa-Csrf';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Acrescenta o cabeçalho anti-CSRF às chamadas que alteram estado na própria API.
 * Um formulário de outro site não consegue enviar esse cabeçalho, por isso ele basta
 * como prova de que a requisição saiu deste painel.
 */
export const csrfInterceptor: HttpInterceptorFn = (request, next) => {
  if (SAFE_METHODS.has(request.method) || !request.url.startsWith('/api/')) {
    return next(request);
  }

  return next(request.clone({ setHeaders: { [CSRF_HEADER]: '1' } }));
};
