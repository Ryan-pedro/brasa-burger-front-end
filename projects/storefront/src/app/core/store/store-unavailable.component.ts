import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StorefrontLoader } from './storefront-loader.service';

@Component({
  selector: 'app-store-unavailable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loader.status() === 'error') {
      <main class="wrap">
        <h1>Não foi possível carregar a loja</h1>
        <p>Verifique sua conexão e tente de novo.</p>
        <button type="button" class="btn btn-primary" (click)="loader.load()">Tentar de novo</button>
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
  readonly loader = inject(StorefrontLoader);
}
