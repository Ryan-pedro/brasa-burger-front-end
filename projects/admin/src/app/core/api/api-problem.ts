import { HttpErrorResponse } from '@angular/common/http';

/** Código usado quando o servidor não respondeu (sem rede, API fora do ar). */
export const NETWORK_ERROR = 'network_error';

/** Código usado quando a resposta de erro não trouxe um "code" reconhecível. */
export const UNEXPECTED_ERROR = 'unexpected_error';

/**
 * Extrai o "code" estável de uma resposta Problem Details da API.
 * É por ele, e nunca pelo texto do título, que o painel decide o que mostrar.
 */
export function problemCode(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return UNEXPECTED_ERROR;
  }

  if (error.status === 0) {
    return NETWORK_ERROR;
  }

  const body: unknown = error.error;
  if (body && typeof body === 'object' && 'code' in body && typeof body.code === 'string') {
    return body.code;
  }

  return UNEXPECTED_ERROR;
}
