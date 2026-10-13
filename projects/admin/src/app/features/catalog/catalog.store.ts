import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiResult } from '../../core/api/api-problem';
import { CatalogApi } from './catalog.api';
import { Category, CategoryInput, Product, ProductInput } from './catalog.models';

export type CatalogStatus = 'loading' | 'ready' | 'error';

const bySortOrder = <T extends { sortOrder: number; name: string }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'pt-BR');

@Injectable()
export class CatalogStore {
  private readonly api = inject(CatalogApi);

  private readonly _categories = signal<Category[]>([]);
  private readonly _products = signal<Product[]>([]);
  private readonly _selectedId = signal<string | null>(null);

  readonly status = signal<CatalogStatus>('loading');
  readonly notice = signal<string | null>(null);

  readonly categories = computed(() => [...this._categories()].sort(bySortOrder));
  readonly selected = computed(() => this._categories().find((c) => c.id === this._selectedId()) ?? null);
  readonly products = computed(() =>
    this._products()
      .filter((p) => p.categoryId === this._selectedId())
      .sort(bySortOrder),
  );
  readonly productCounts = computed(() =>
    this._products().reduce((counts, p) => counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1), new Map<string, number>()),
  );

  async load(): Promise<void> {
    this.status.set('loading');
    try {
      const [categories, products] = await Promise.all([this.api.categories(), this.api.products()]);
      this._categories.set(categories);
      this._products.set(products);
      if (!categories.some((c) => c.id === this._selectedId())) {
        this._selectedId.set(this.categories()[0]?.id ?? null);
      }
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  select(categoryId: string): void {
    this._selectedId.set(categoryId);
  }

  async saveCategory(id: string | null, input: CategoryInput): Promise<ApiResult<Category>> {
    const result = await this.api.saveCategory(id, input);
    if (result.ok) {
      this._categories.update((list) => upsert(list, result.value));
      this._selectedId.set(result.value.id);
    }
    return result;
  }

  async saveProduct(id: string | null, input: ProductInput): Promise<ApiResult<Product>> {
    const result = await this.api.saveProduct(id, input);
    if (result.ok) {
      this._products.update((list) => upsert(list, result.value));
    }
    return result;
  }

  async toggleAvailability(product: Product): Promise<void> {
    const isAvailable = !product.isAvailable;
    this.notice.set(null);
    this._products.update((list) => upsert(list, { ...product, isAvailable }));

    const result = await this.api.setAvailability(product.id, isAvailable);
    if (result.ok) {
      this._products.update((list) => upsert(list, result.value));
      return;
    }

    this._products.update((list) => upsert(list, product));
    this.notice.set(`Não foi possível alterar "${product.name}". Tente de novo.`);
  }
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
}
