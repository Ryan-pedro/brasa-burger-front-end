import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

/** Perfil público da loja, devolvido por GET /api/v1/store/profile. */
export interface StoreProfile {
  name: string;
  timeZoneId: string;
}

export type StoreStatus = 'loading' | 'ready' | 'error';

/** Os dados da loja, carregados da API antes da primeira tela. */
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
   * Nunca rejeita: em caso de falha, o estado vira "error" e a tela de erro é exibida.
   */
  async load(): Promise<void> {
    this._status.set('loading');
    try {
      const profile = await firstValueFrom(this.http.get<StoreProfile>('/api/v1/store/profile'));
      this._profile.set(profile);
      this._status.set('ready');
    } catch {
      this._profile.set(null);
      this._status.set('error');
    }
  }
}
