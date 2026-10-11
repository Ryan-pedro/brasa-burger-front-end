import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CartLine } from '../core/models/order.model';
import { CartService } from '../core/services/cart.service';
import { MenuService } from '../core/services/menu.service';
import { ProductSheetService } from '../core/services/product-sheet.service';
import { lineDetails, unitPrice } from '../core/utils/pricing';
import { BrlPipe } from './brl.pipe';
import { IconComponent } from './icon.component';
import { QtyStepperComponent } from './qty-stepper.component';

/**
 * Item do pedido.
 *  - editable: foto, quantidade, editar e remover (tela do carrinho);
 *  - compacto: só leitura (revisão do pedido).
 */
@Component({
  selector: 'app-cart-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrlPipe, IconComponent, QtyStepperComponent],
  template: `
    @let p = product();
    @if (editable()) {
      <article class="line card fade-in">
        <span class="thumb" [style.background]="menu.tint(p)"><img [src]="p.image" alt=""></span>
        <div class="info">
          <div class="top">
            <h3 class="name">{{ p.name }}</h3>
            <button type="button" class="remove" (click)="cart.remove(line().key)" [attr.aria-label]="'Remover ' + p.name">
              <app-icon name="trash" [size]="19" />
            </button>
          </div>
          @for (d of details(); track d.text) { <span class="detail" [class]="d.kind">{{ d.text }}</span> }
          @if (line().note.trim()) { <span class="note-pill">Obs: {{ line().note }}</span> }
          <span class="unit">{{ unit() | brl }} un.</span>
          <div class="bottom">
            <app-qty-stepper [value]="line().qty" (increase)="cart.increment(line().key)" (decrease)="cart.decrement(line().key)" />
            @if (p.customization) {
              <button type="button" class="edit" (click)="sheet.open(p, line())"><app-icon name="edit" [size]="15" [stroke]="2.2" />Editar</button>
            }
            <span class="total price">{{ unit() * line().qty | brl }}</span>
          </div>
        </div>
      </article>
    } @else {
      <div class="compact">
        <span class="qty">{{ line().qty }}x</span>
        <div class="info">
          <span class="name">{{ p.name }}</span>
          @for (d of details(); track d.text) { <span class="detail" [class]="d.kind">{{ d.text }}</span> }
          @if (line().note.trim()) { <span class="note-pill">Obs: {{ line().note }}</span> }
        </div>
        <span class="compact-total">{{ unit() * line().qty | brl }}</span>
      </div>
    }
  `,
  styles: `
    .line { padding: 12px; display: flex; gap: 12px; border-radius: 22px; }
    .thumb { width: 84px; height: 84px; border-radius: 16px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .thumb img { width: 96px; max-width: none; }
    .info { flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .name { font-size: 16px; font-weight: 900; line-height: 1.2; }
    .remove { width: 36px; height: 36px; margin: -6px -4px 0 0; border: 0; background: none; color: #8A7D72; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .remove:hover { color: var(--danger); }
    .detail { font-size: 13px; font-weight: 600; color: var(--muted); }
    .detail.extra { color: var(--success); }
    .detail.removed { color: var(--danger); }
    .unit { font-size: 12px; color: var(--muted); }
    .bottom { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
    .edit { border: 0; background: none; color: var(--red); font-weight: 900; font-size: 14px; display: flex; align-items: center; gap: 4px; height: 40px; }
    .total { margin-left: auto; font-size: 18px; }
    .compact { display: flex; gap: 12px; align-items: flex-start; }
    .qty { min-width: 36px; height: 30px; border-radius: 9px; background: var(--red); color: var(--white); font-weight: 900; font-size: 14px;
      display: flex; align-items: center; justify-content: center; }
    .compact .name { font-size: 16px; font-weight: 900; }
    .compact-total { font-weight: 900; font-size: 15px; white-space: nowrap; }
  `,
})
export class CartLineComponent {
  readonly cart = inject(CartService);
  readonly menu = inject(MenuService);
  readonly sheet = inject(ProductSheetService);

  readonly line = input.required<CartLine>();
  readonly editable = input(true);

  readonly product = computed(() => this.menu.getById(this.line().productId));
  readonly unit = computed(() => unitPrice(this.product(), this.line()));
  readonly details = computed(() => lineDetails(this.product(), this.line()));
}
