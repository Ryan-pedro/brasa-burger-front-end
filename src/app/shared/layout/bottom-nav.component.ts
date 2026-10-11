import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { IconComponent, IconName } from '../icon.component';

/** Navegação inferior — só no celular. */
@Component({
  selector: 'app-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <nav class="nav" aria-label="Principal">
      @for (item of items; track item.path) {
        <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/' }">
          <span class="pill">
            <app-icon [name]="item.icon" />
            @if (item.path === '/carrinho' && cart.count() > 0) {
              <span class="badge check-pop">{{ cart.count() }}</span>
            }
          </span>
          {{ item.label }}
        </a>
      }
    </nav>
  `,
  styles: `
    .nav { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; height: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom));
      padding: 6px 6px calc(8px + env(safe-area-inset-bottom)); background: var(--white); border-top: 1px solid var(--line);
      display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); }
    a { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
      color: var(--muted); font-size: 11px; font-weight: 900; text-decoration: none; }
    .pill { position: relative; width: 48px; height: 30px; border-radius: 15px; display: flex; align-items: center; justify-content: center; }
    a.active { color: var(--red); }
    a.active .pill { background: var(--tint-red); }
    .badge { position: absolute; top: -4px; right: 2px; min-width: 20px; height: 20px; border-radius: 10px; background: var(--red);
      color: var(--white); font-size: 11px; display: flex; align-items: center; justify-content: center; padding: 0 5px; border: 2px solid var(--white); }
    @media (min-width: 768px) { .nav { display: none; } }
  `,
})
export class BottomNavComponent {
  readonly cart = inject(CartService);
  readonly items: { path: string; label: string; icon: IconName }[] = [
    { path: '/', label: 'Início', icon: 'home' },
    { path: '/cardapio', label: 'Cardápio', icon: 'burger' },
    { path: '/bebidas', label: 'Bebidas', icon: 'cup' },
    { path: '/promocoes', label: 'Promoções', icon: 'tag' },
    { path: '/carrinho', label: 'Carrinho', icon: 'bag' },
  ];
}
