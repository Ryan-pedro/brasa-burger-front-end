import { TestBed } from '@angular/core/testing';
import { CatalogApi } from './catalog.api';
import { Category, Product } from './catalog.models';
import { CatalogStore } from './catalog.store';

const burgers: Category = { id: 'c1', name: 'Hambúrgueres', slug: 'hamburgueres', sortOrder: 1, isActive: true };
const drinks: Category = { id: 'c2', name: 'Bebidas', slug: 'bebidas', sortOrder: 0, isActive: true };
const xBacon: Product = {
  id: 'p1',
  categoryId: 'c1',
  name: 'X-Bacon',
  description: '',
  priceInCents: 2490,
  size: null,
  imageUrl: null,
  isAvailable: true,
  isFeatured: false,
  sortOrder: 0,
};

describe('CatalogStore', () => {
  let api: { [K in keyof CatalogApi]: ReturnType<typeof vi.fn> };
  let store: CatalogStore;

  beforeEach(async () => {
    api = {
      categories: vi.fn().mockResolvedValue([burgers, drinks]),
      products: vi.fn().mockResolvedValue([xBacon]),
      saveCategory: vi.fn(),
      saveProduct: vi.fn(),
      setAvailability: vi.fn(),
    };
    TestBed.configureTestingModule({ providers: [CatalogStore, { provide: CatalogApi, useValue: api }] });
    store = TestBed.inject(CatalogStore);
    await store.load();
  });

  it('carrega em ordem e seleciona a primeira categoria', () => {
    expect(store.status()).toBe('ready');
    expect(store.categories().map((c) => c.name)).toEqual(['Bebidas', 'Hambúrgueres']);
    expect(store.selected()?.id).toBe('c2');
    expect(store.productCounts().get('c1')).toBe(1);
  });

  it('mostra só os produtos da categoria escolhida', () => {
    store.select('c1');

    expect(store.products().map((p) => p.name)).toEqual(['X-Bacon']);
  });

  it('falha ao carregar vira estado de erro', async () => {
    api.categories.mockRejectedValue(new Error('offline'));

    await store.load();

    expect(store.status()).toBe('error');
  });

  it('troca a disponibilidade na hora e confirma com a API', async () => {
    store.select('c1');
    let resolve!: (value: unknown) => void;
    api.setAvailability.mockReturnValue(new Promise((r) => (resolve = r)));

    const toggling = store.toggleAvailability(xBacon);
    expect(store.products()[0].isAvailable).toBe(false);

    resolve({ ok: true, value: { ...xBacon, isAvailable: false } });
    await toggling;
    expect(store.products()[0].isAvailable).toBe(false);
    expect(store.notice()).toBeNull();
  });

  it('desfaz a troca e avisa quando a API recusa', async () => {
    store.select('c1');
    api.setAvailability.mockResolvedValue({ ok: false, code: 'network_error', fields: {} });

    await store.toggleAvailability(xBacon);

    expect(store.products()[0].isAvailable).toBe(true);
    expect(store.notice()).toContain('X-Bacon');
  });

  it('produto salvo entra na lista', async () => {
    const created = { ...xBacon, id: 'p2', name: 'X-Salada' };
    api.saveProduct.mockResolvedValue({ ok: true, value: created });
    store.select('c1');

    await store.saveProduct(null, { ...created, size: null, imageUrl: null });

    expect(store.products().map((p) => p.name)).toEqual(['X-Bacon', 'X-Salada']);
  });

  it('categoria salva fica selecionada', async () => {
    const created: Category = { id: 'c3', name: 'Porções', slug: 'porcoes', sortOrder: 2, isActive: true };
    api.saveCategory.mockResolvedValue({ ok: true, value: created });

    await store.saveCategory(null, { name: 'Porções', isActive: true });

    expect(store.selected()?.id).toBe('c3');
  });
});
