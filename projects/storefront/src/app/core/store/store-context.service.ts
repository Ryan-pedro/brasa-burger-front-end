import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

/** Perfil público da loja, devolvido por GET /api/v1/store/profile. */
export interface StoreProfile {
  slug: string;
  name: string;
  timeZoneId: string;
}

export type StoreStatus = 'loading' | 'ready' | 'not-found' | 'unavailable' | 'error';

/**
 * A loja em que o cliente está.
 *
 * O navegador não escolhe a loja: a API a deduz pelo endereço (host) de onde a
 * requisição chega. Este serviço só pergunta "qual é a loja deste endereço?".
 */
@Injectable({ providedIn: 'root' })
export class StoreContext {
  private readonly http = inject(HttpClient);

  private readonly _profile = signal<StoreProfile | null>(null);
  private readonly _status = signal<StoreStatus>('loading');

  readonly profile = this._profile.asReadonly();
  readonly status = this._status.asReadonly();
  readonly name = computed(() => this._profile()?.name ?? '');

  /**
   * Carrega o perfil antes de a aplicação iniciar.
   * Nunca rejeita: em caso de falha, o estado indica o motivo e a tela correspondente é exibida.
   */
  async load(): Promise<void> {
    this._status.set('loading');
    try {
      const profile = await firstValueFrom(this.http.get<StoreProfile>('/api/v1/store/profile'));
      this._profile.set(profile);
      this._status.set('ready');
    } catch (error) {
      this._profile.set(null);
      this._status.set(statusFor(error));
    }
  }
}

function statusFor(error: unknown): StoreStatus {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 404) return 'not-found';
    if (error.status === 403) return 'unavailable';
  }
  return 'error';
}
