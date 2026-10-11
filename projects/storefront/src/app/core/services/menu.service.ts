import { Injectable } from '@angular/core';
import { BEST_SELLER_IDS, CATEGORIES, DRINK_CATEGORIES, IMAGE_TINTS, PRODUCTS, UPSELL_IDS } from '../data/menu.data';
import { CategoryId, DrinkCategoryId, Product } from '../models/menu.model';

/**
 * Fonte do cardápio.
 * Hoje lê os dados mockados; para integrar com a API basta trocar a implementação
 * por chamadas HttpClient (ex.: GET /api/produtos) mantendo a mesma interface.
 */
@Injectable({ providedIn: 'root' })
export class MenuService {
  readonly categories = CATEGORIES;
  readonly drinkCategories = DRINK_CATEGORIES;
  private readonly products = PRODUCTS;
  private readonly index = new Map(PRODUCTS.map(p => [p.id, p]));

  getById(id: string): Product {
    const p = this.index.get(id);
    if (!p) throw new Error(`Produto não encontrado: ${id}`);
    return p;
  }

  byCategory(category: CategoryId, search = ''): Product[] {
    const q = search.trim().toLowerCase();
    return this.products.filter(p => p.category === category && (!q || p.name.toLowerCase().includes(q)));
  }

  drinks(sub: DrinkCategoryId | 'all' = 'all'): Product[] {
    return this.products.filter(p => p.category === 'drink' && (sub === 'all' || p.drinkCategory === sub));
  }

  bestSellers(): Product[] {
    return BEST_SELLER_IDS.map(id => this.getById(id));
  }

  upsell(): Product[] {
    return UPSELL_IDS.map(id => this.getById(id));
  }

  /** Cor de fundo atrás da foto do produto. */
  tint(p: Product): string {
    return IMAGE_TINTS[p.drinkCategory ?? p.category] ?? '#FCEBD6';
  }
}
