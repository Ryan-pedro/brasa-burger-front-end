import { Injectable, computed, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { MenuService } from '../services/menu.service';
import { StoreContext } from './store-context.service';

export type LoadStatus = 'loading' | 'ready' | 'error';

@Injectable({ providedIn: 'root' })
export class StorefrontLoader {
  private readonly store = inject(StoreContext);
  private readonly menu = inject(MenuService);
  private readonly cart = inject(CartService);

  readonly status = computed<LoadStatus>(() => {
    const statuses = [this.store.status(), this.menu.status()];
    if (statuses.includes('error')) return 'error';
    return statuses.every((s) => s === 'ready') ? 'ready' : 'loading';
  });

  async load(): Promise<void> {
    await Promise.all([this.store.load(), this.menu.load()]);
    if (this.menu.status() === 'ready') {
      this.cart.retain((productId) => this.menu.has(productId));
    }
  }
}
