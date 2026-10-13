import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface StoreProfile {
  name: string;
  timeZoneId: string;
}

/** Nome da loja para o cabeçalho e o login. Não bloqueia a abertura do painel. */
@Injectable({ providedIn: 'root' })
export class StoreProfileService {
  private readonly http = inject(HttpClient);
  private readonly _profile = signal<StoreProfile | null>(null);

  readonly name = computed(() => this._profile()?.name ?? '');

  async load(): Promise<void> {
    try {
      this._profile.set(await firstValueFrom(this.http.get<StoreProfile>('/api/v1/store/profile')));
    } catch {
      // Sem o nome, o painel mostra só "Painel da loja".
    }
  }
}
