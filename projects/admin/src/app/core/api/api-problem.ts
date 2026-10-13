import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

export const NETWORK_ERROR = 'network_error';
export const UNEXPECTED_ERROR = 'unexpected_error';

export type FieldErrors = Readonly<Record<string, readonly string[]>>;

export type ApiResult<T> = { ok: true; value: T } | { ok: false; code: string; fields: FieldErrors };

export function problemCode(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return UNEXPECTED_ERROR;
  }

  if (error.status === 0) {
    return NETWORK_ERROR;
  }

  const body = problemBody(error);
  return typeof body?.['code'] === 'string' ? body['code'] : UNEXPECTED_ERROR;
}

export function problemFields(error: unknown): FieldErrors {
  const errors = error instanceof HttpErrorResponse ? problemBody(error)?.['errors'] : undefined;
  return errors && typeof errors === 'object' ? (errors as FieldErrors) : {};
}

export async function toResult<T>(request: Observable<T>): Promise<ApiResult<T>> {
  try {
    return { ok: true, value: await firstValueFrom(request) };
  } catch (error) {
    return { ok: false, code: problemCode(error), fields: problemFields(error) };
  }
}

function problemBody(error: HttpErrorResponse): Record<string, unknown> | null {
  const body: unknown = error.error;
  return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
}
