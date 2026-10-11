import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { LogoMarkComponent } from '../logo.component';

/**
 * Cabeçalho das telas de navegação: barra branca arredondada.
 * Celular: logo + "Pedir agora". Tablet/desktop: links + carrinho.
 */
@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, LogoMarkComponent],
  template: `
    <header class="header" [class.on-red]="onRed()">
      <div class="bar container-bar">
        <a routerLink="/" class="brand" aria-label="Brasa Burger — início">
          <app-logo-mark [size]="40" />
          <span class="brand-text">
            <span class="brand-name">BRASA</span>
            <span class="brand-sub">BURGER &amp; CO.</span>
          </span>
        </a>

        <nav class="links" aria-label="Principal">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Início</a>
          <a routerLink="/cardapio" routerLinkActive="active">Cardápio</a>
          <a routerLink="/bebidas" routerLinkActive="active">Bebidas</a>
          <a routerLink="/promocoes" routerLinkActive="active">Promoções</a>
        </nav>

        <a routerLink="/cardapio" class="btn btn-primary btn-sm cta-mobile">Pedir agora</a>
        <a routerLink="/carrinho" class="btn btn-primary btn-sm cart-desktop">
          Carrinho <span class="count">{{ cart.count() }}</span>
        </a>
      </div>
    </header>
  `,
  styles: `
    .header { position: sticky; top: 0; z-index: 40; background: var(--cream); padding: 10px 12px 8px; transition: background .2s; }
    .header.on-red { background: var(--red); }
    .container-bar { max-width: var(--container); margin: 0 auto; }
    .bar { background: var(--white); border-radius: 999px; box-shadow: 0 8px 22px rgba(90, 10, 20, .14);
      display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 6px 6px 10px; min-height: 56px; }
    .brand { display: flex; align-items: center; gap: 9px; text-decoration: none; }
    .brand-text { display: flex; flex-direction: column; line-height: 1; }
    .brand-name { font-family: var(--font-display); font-size: 21px; color: var(--red); letter-spacing: .02em; }
    .brand-sub { font-size: 10px; font-weight: 900; letter-spacing: .2em; color: var(--ink); }
    .btn { box-shadow: none; }
    .links, .cart-desktop { display: none; }
    .links a { color: var(--ink); text-decoration: none; font-weight: 900; font-size: 15px; letter-spacing: .04em;
      text-transform: uppercase; padding: 12px 14px; border-radius: 12px; }
    .links a.active, .links a:hover { color: var(--red); }
    .count { min-width: 30px; height: 30px; border-radius: 15px; background: var(--yellow); color: var(--ink);
      display: inline-flex; align-items: center; justify-content: center; padding: 0 6px; margin-right: -10px; }
    @media (min-width: 768px) {
      .header { padding: 12px 28px 10px; }
      .links { display: flex; gap: 4px; }
      .cart-desktop { display: inline-flex; }
      .cta-mobile { display: none; }
    }
  `,
})
export class SiteHeaderComponent {
  readonly cart = inject(CartService);
  /** Fundo vermelho na Home, para emendar com o hero. */
  readonly onRed = input(false);
}
