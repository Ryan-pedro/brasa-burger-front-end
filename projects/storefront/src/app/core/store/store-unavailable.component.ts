import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { StoreContext, StoreStatus } from './store-context.service';

const MESSAGES: Record<Exclude<StoreStatus, 'ready' | 'loading'>, { title: string; text: string }> = {
  'not-found': {
    title: 'Loja não encontrada',
    text: 'Não existe nenhuma loja neste endereço. Confira o link e tente de novo.',
  },
  unavailable: {
    title: 'Loja indisponível',
    text: 'Esta loja não está recebendo pedidos no momento.',
  },
  error: {
    title: 'Não foi possível carregar a loja',
    text: 'Verifique sua conexão e tente de novo.',
  },
};

/** Tela exibida quando a loja do endereço não pôde ser carregada. */
@Component({
  selector: 'app-store-unavailable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message(); as m) {
      <main class="wrap">
        <h1>{{ m.title }}</h1>
        <p>{{ m.text }}</p>
        @if (store.status() === 'error') {
          <button type="button" class="btn btn-primary" (click)="store.load()">Tentar de novo</button>
        }
      </main>
    }
  `,
  styles: `
    .wrap { min-height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 12px; padding: 24px; text-align: center; background: var(--cream); color: var(--ink); }
    h1 { font-family: var(--font-display); font-size: 30px; margin: 0; }
    p { margin: 0 0 8px; max-width: 360px; color: var(--muted); font-size: 16px; }
  `,
})
export class StoreUnavailableComponent {
  readonly store = inject(StoreContext);

  readonly message = computed(() => {
    const status = this.store.status();
    return status === 'ready' || status === 'loading' ? null : MESSAGES[status];
  });
}
