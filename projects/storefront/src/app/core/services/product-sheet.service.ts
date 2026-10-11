import { Injectable, inject, signal } from '@angular/core';
import { Product } from '../models/menu.model';
import { CartLine } from '../models/order.model';
import { CartService } from './cart.service';

export interface ProductSheetState {
  product: Product;
  /** Linha existente quando o cliente está editando um item do carrinho. */
  editing?: CartLine;
}

/** Controla a abertura do modal de produto/personalização. */
@Injectable({ providedIn: 'root' })
export class ProductSheetService {
  private readonly cart = inject(CartService);
  readonly state = signal<ProductSheetState | null>(null);

  /**
   * Botão "+" dos cards: produtos personalizáveis abrem o modal;
   * os demais entram direto no carrinho.
   */
  quickAdd(product: Product): void {
    if (product.unavailable) return;
    if (product.customization) {
      this.open(product);
    } else {
      this.cart.add({ productId: product.id, qty: 1, extras: [], removed: [], choice: null, note: '' });
    }
  }

  open(product: Product, editing?: CartLine): void {
    if (product.unavailable) return;
    this.state.set({ product, editing });
  }

  close(): void {
    this.state.set(null);
  }
}
