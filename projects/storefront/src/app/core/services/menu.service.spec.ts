import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MenuResponse } from './menu.mapper';
import { MenuService } from './menu.service';

const product = (id: string, name: string, priceInCents: number, extra: object = {}) => ({
  id, name, description: '', priceInCents, size: null, imageUrl: `img/${id}.svg`, isAvailable: true, isFeatured: false, ...extra,
});

const MENU: MenuResponse = {
  categories: [
    { id: 'c-b', name: 'Hambúrgueres', slug: 'hamburgueres', products: [product('x-bacon', 'X-Bacon', 2490, { isFeatured: true })] },
    { id: 'c-c', name: 'Combos', slug: 'combos', products: [product('combo', 'Combo da Semana', 3290)] },
    { id: 'c-p', name: 'Porções', slug: 'porcoes', products: [product('fritas', 'Batata Frita Grande', 1990)] },
    {
      id: 'c-d',
      name: 'Bebidas',
      slug: 'bebidas',
      products: [product('coca', 'Coca-Cola', 600, { size: '350ml', isFeatured: true }), product('agua', 'Água com gás', 450, { isAvailable: false })],
    },
  ],
};

describe('MenuService', () => {
  let menu: MenuService;
  let http: HttpTestingController;

  async function load(response: MenuResponse = MENU) {
    const loading = menu.load();
    http.expectOne('/api/v1/store/menu').flush(response);
    await loading;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    menu = TestBed.inject(MenuService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('converte o cardápio da API para o modelo da loja', async () => {
    await load();

    const xBacon = menu.getById('x-bacon');
    expect(menu.status()).toBe('ready');
    expect(xBacon.price).toBe(24.9);
    expect(xBacon.category).toBe('hamburgueres');
    expect(xBacon.customization).toBe('burger');
    expect(xBacon.ingredients?.length).toBeGreaterThan(0);
    expect(menu.getById('coca').size).toBe('350ml');
    expect(menu.getById('agua').unavailable).toBe(true);
  });

  it('separa as bebidas das categorias do cardápio', async () => {
    await load();

    expect(menu.categories().map((c) => c.id)).toEqual(['hamburgueres', 'combos', 'porcoes']);
    expect(menu.drinks().map((p) => p.id)).toEqual(['coca', 'agua']);
  });

  it('monta destaques, combo da semana e sugestões só com itens disponíveis', async () => {
    await load();

    expect(menu.bestSellers().map((p) => p.id)).toEqual(['x-bacon', 'coca']);
    expect(menu.weeklyCombo()?.id).toBe('combo');
    expect(menu.upsell().map((p) => p.id)).toEqual(['coca', 'fritas']);
  });

  it('busca por nome dentro da categoria', async () => {
    await load();

    expect(menu.byCategory('hamburgueres', 'bacon').map((p) => p.id)).toEqual(['x-bacon']);
    expect(menu.byCategory('hamburgueres', 'salada')).toEqual([]);
  });

  it('falha da API vira estado de erro', async () => {
    const loading = menu.load();
    http.expectOne('/api/v1/store/menu').flush(null, { status: 500, statusText: 'Server Error' });
    await loading;

    expect(menu.status()).toBe('error');
  });
});
