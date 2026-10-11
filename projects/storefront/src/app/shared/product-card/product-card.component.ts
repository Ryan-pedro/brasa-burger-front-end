import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Product } from '../../core/models/menu.model';
import { CartService } from '../../core/services/cart.service';
import { MenuService } from '../../core/services/menu.service';
import { ProductSheetService } from '../../core/services/product-sheet.service';
import { BrlPipe } from '../brl.pipe';
import { IconComponent } from '../icon.component';

/**
 * Card de produto.
 *  - `grid`: card vertical do cardápio (foto em cima).
 *  - `row`: card horizontal usado em bebidas.
 */
@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrlPipe, IconComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  host: { '[class]': "'variant-' + variant()" },
})
export class ProductCardComponent {
  private readonly cart = inject(CartService);
  private readonly menu = inject(MenuService);
  private readonly sheet = inject(ProductSheetService);

  readonly product = input.required<Product>();
  readonly variant = input<'grid' | 'row'>('grid');

  readonly tint = computed(() => this.menu.tint(this.product()));
  readonly inCart = computed(() => this.cart.qtyByProduct().get(this.product().id) ?? 0);

  open(): void {
    this.sheet.open(this.product());
  }

  add(): void {
    this.sheet.quickAdd(this.product());
  }
}
