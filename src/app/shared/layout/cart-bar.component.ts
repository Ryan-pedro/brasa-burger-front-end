import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { BrlPipe } from '../brl.pipe';
import { IconComponent } from '../icon.component';

/** Barra flutuante "3 itens — R$ 49,80 · Ver carrinho". */
@Component({
  selector: 'app-cart-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BrlPipe, IconComponent],
  template: `
    @if (cart.count() > 0) {
      <a routerLink="/carrinho" class="bar fade-in">
        <span class="icon"><app-icon name="bag" [size]="20" /></span>
        <span class="text">{{ cart.count() }} {{ cart.count() === 1 ? 'item' : 'itens' }} — {{ checkout.totals().total | brl }}</span>
        <span class="cta">Ver carrinho</span>
      </a>
    }
  `,
  styles: `
    .bar { position: fixed; z-index: 45; left: 12px; right: 12px; bottom: calc(var(--bottom-nav-h) + 10px + env(safe-area-inset-bottom));
      height: 60px; border-radius: 999px; background: var(--red); color: var(--white); text-decoration: none;
      display: flex; align-items: center; gap: 12px; padding: 0 9px 0 10px; box-shadow: 0 14px 30px rgba(120, 8, 25, .35); }
    .bar:hover { color: var(--white); filter: brightness(1.05); }
    .icon { width: 42px; height: 42px; border-radius: 50%; background: var(--red-dark); display: flex; align-items: center; justify-content: center; }
    .text { font-size: 15px; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
    .cta { margin-left: auto; height: 44px; padding: 0 16px; border-radius: 999px; background: var(--yellow); color: var(--ink);
      font-weight: 900; font-size: 14px; display: flex; align-items: center; white-space: nowrap; flex-shrink: 0; }
    @media (min-width: 768px) { .bar { left: auto; right: 32px; bottom: 28px; width: 400px; } }
  `,
})
export class CartBarComponent {
  readonly cart = inject(CartService);
  readonly checkout = inject(CheckoutService);
}
