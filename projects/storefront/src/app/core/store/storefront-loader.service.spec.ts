import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { MenuService } from '../services/menu.service';
import { StoreContext } from './store-context.service';
import { StorefrontLoader } from './storefront-loader.service';

describe('StorefrontLoader', () => {
  const storeStatus = signal<'loading' | 'ready' | 'error'>('loading');
  const menuStatus = signal<'loading' | 'ready' | 'error'>('loading');
  const retain = vi.fn();

  beforeEach(() => {
    retain.mockReset();
    TestBed.configureTestingModule({
      providers: [
        { provide: StoreContext, useValue: { status: storeStatus, load: async () => storeStatus.set('ready') } },
        { provide: MenuService, useValue: { status: menuStatus, load: async () => menuStatus.set('ready'), has: (id: string) => id === 'existe' } },
        { provide: CartService, useValue: { retain } },
      ],
    });
  });

  it('fica pronto quando loja e cardápio carregam e limpa itens que saíram do cardápio', async () => {
    const loader = TestBed.inject(StorefrontLoader);
    expect(loader.status()).toBe('loading');

    await loader.load();

    expect(loader.status()).toBe('ready');
    const keep = retain.mock.calls[0][0] as (id: string) => boolean;
    expect(keep('existe')).toBe(true);
    expect(keep('antigo')).toBe(false);
  });

  it('qualquer falha vira erro', () => {
    storeStatus.set('ready');
    menuStatus.set('error');

    expect(TestBed.inject(StorefrontLoader).status()).toBe('error');
  });
});
