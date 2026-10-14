import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { MenuService } from '../../core/services/menu.service';
import { ProductSheetService } from '../../core/services/product-sheet.service';
import { BrlPipe } from '../../shared/brl.pipe';
import { CartLineComponent } from '../../shared/cart-line.component';
import { IconComponent } from '../../shared/icon.component';
import { OrderSummaryComponent } from '../../shared/order-summary.component';

@Component({
  selector: 'app-cart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BrlPipe, CartLineComponent, IconComponent, OrderSummaryComponent],
  template: `
    <div class="container-narrow screen-in page">
      <div class="head">
        <h1 class="page-title">Seu pedido</h1>
        @if (!cart.isEmpty()) { <span class="muted">{{ cart.count() }} {{ cart.count() === 1 ? 'item' : 'itens' }}</span> }
      </div>

      @if (cart.isEmpty()) {
        <div class="empty card fade-in">
          <span class="empty-icon"><app-icon name="bag" [size]="44" [stroke]="1.8" /></span>
          <h2>Seu carrinho está vazio.</h2>
          <p class="muted">Escolha um lanche no cardápio e monte do seu jeito.</p>
          <a routerLink="/cardapio" class="btn btn-primary">Explorar cardápio</a>
        </div>
      } @else {
        <div class="lines">
          @for (l of cart.lines(); track l.key) {
            <app-cart-line [line]="l" />
          }
        </div>

        <section class="upsell">
          <h2>Que tal acompanhar?</h2>
          <div class="upsell-row no-scrollbar">
            @for (p of upsell(); track p.id) {
              <div class="up card">
                <span class="up-img" [style.background]="menu.tint(p)"><img [src]="p.image" alt=""></span>
                <span class="up-name">{{ p.name }} {{ p.size }}</span>
                <div class="up-foot">
                  <strong>{{ p.price | brl }}</strong>
                  <button type="button" class="icon-btn" (click)="sheet.quickAdd(p)" [attr.aria-label]="'Adicionar ' + p.name">
                    <app-icon name="plus" [size]="18" [stroke]="2.6" />
                  </button>
                </div>
              </div>
            }
          </div>
        </section>

        <app-order-summary [totals]="checkout.totals()" [feeLabel]="checkout.type() === 'delivery' ? 'Taxa de entrega' : 'Taxa'" />

        <div class="actions">
          <a routerLink="/pedido/tipo" class="btn btn-primary btn-lg btn-block">Finalizar pedido <app-icon name="arrow-right" [size]="20" [stroke]="2.4" /></a>
          <a routerLink="/cardapio" class="btn btn-outline btn-block">Continuar comprando</a>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; padding-bottom: 40px; }
    .page { padding-top: 22px; display: flex; flex-direction: column; gap: 16px; }
    .head { display: flex; align-items: baseline; justify-content: space-between; }
    .empty { padding: 40px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
    .empty h2 { font-family: var(--font-display); font-weight: 400; font-size: 24px; text-transform: uppercase; }
    .empty p { max-width: 260px; }
    .empty-icon { width: 96px; height: 96px; border-radius: 50%; background: var(--tint-red); color: var(--red);
      display: flex; align-items: center; justify-content: center; }
    .lines { display: flex; flex-direction: column; gap: 12px; }
    .upsell h2 { font-size: 17px; font-weight: 900; margin-bottom: 10px; }
    .upsell-row { display: flex; gap: 10px; overflow-x: auto; margin: 0 calc(var(--gutter) * -1); padding: 2px var(--gutter) 6px; }
    .up { flex-shrink: 0; width: 140px; border-radius: 18px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
    .up-img { height: 74px; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .up-img img { width: 100px; max-width: none; }
    .up-name { font-size: 13px; font-weight: 900; line-height: 1.2; min-height: 32px; }
    .up-foot { display: flex; align-items: center; justify-content: space-between; }
    .up-foot strong { font-size: 14px; }
    .up .icon-btn { width: 36px; height: 36px; }
    .actions { display: flex; flex-direction: column; gap: 10px; }
  `,
})
export class CartPage {
  readonly cart = inject(CartService);
  readonly checkout = inject(CheckoutService);
  readonly menu = inject(MenuService);
  readonly sheet = inject(ProductSheetService);
  readonly upsell = this.menu.upsell;
}
