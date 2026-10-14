import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CATEGORY_TINTS, DEFAULT_TINT, MENU_SLUGS } from '../data/menu.data';
import { CategoryId, Product } from '../models/menu.model';
import { Menu, MenuResponse, toMenu } from './menu.mapper';

export type MenuStatus = 'loading' | 'ready' | 'error';

const UPSELL_LIMIT = 5;

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);

  private readonly menu = signal<Menu>({ categories: [], products: [] });
  private readonly _status = signal<MenuStatus>('loading');
  private readonly index = computed(() => new Map(this.menu().products.map((p) => [p.id, p])));

  readonly status = this._status.asReadonly();
  readonly categories = computed(() => this.menu().categories.filter((c) => c.id !== MENU_SLUGS.drinks));
  readonly drinks = computed(() => this.inCategory(MENU_SLUGS.drinks));
  readonly bestSellers = computed(() => this.menu().products.filter((p) => p.popular));
  readonly weeklyCombo = computed(() => {
    const combos = this.inCategory(MENU_SLUGS.combos);
    return combos.find((p) => p.popular) ?? combos[0] ?? null;
  });
  readonly upsell = computed(() =>
    [...this.inCategory(MENU_SLUGS.drinks), ...this.inCategory(MENU_SLUGS.sides)]
      .filter((p) => !p.unavailable)
      .sort((a, b) => Number(!!b.popular) - Number(!!a.popular))
      .slice(0, UPSELL_LIMIT),
  );

  async load(): Promise<void> {
    this._status.set('loading');
    try {
      this.menu.set(toMenu(await firstValueFrom(this.http.get<MenuResponse>('/api/v1/store/menu'))));
      this._status.set('ready');
    } catch {
      this._status.set('error');
    }
  }

  has(id: string): boolean {
    return this.index().has(id);
  }

  getById(id: string): Product {
    const product = this.index().get(id);
    if (!product) throw new Error(`Produto não encontrado: ${id}`);
    return product;
  }

  byCategory(category: CategoryId, search = ''): Product[] {
    const query = search.trim().toLowerCase();
    return this.inCategory(category).filter((p) => !query || p.name.toLowerCase().includes(query));
  }

  tint(product: Product): string {
    return CATEGORY_TINTS[product.category] ?? DEFAULT_TINT;
  }

  private inCategory(category: CategoryId): Product[] {
    return this.menu().products.filter((p) => p.category === category);
  }
}
