import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StoreContext } from './store-context.service';

describe('StoreContext', () => {
  let store: StoreContext;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    store = TestBed.inject(StoreContext);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('começa carregando, sem loja', () => {
    expect(store.status()).toBe('loading');
    expect(store.profile()).toBeNull();
    expect(store.name()).toBe('');
  });

  it('pede o perfil sem informar a loja: quem decide é o servidor, pelo endereço', async () => {
    const loading = store.load();
    const request = http.expectOne('/api/v1/store/profile');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);

    request.flush({ slug: 'brasa', name: 'Brasa Burger', timeZoneId: 'America/Sao_Paulo' });
    await loading;

    expect(store.status()).toBe('ready');
    expect(store.name()).toBe('Brasa Burger');
  });

  it('endereço sem loja vira "not-found"', async () => {
    const loading = store.load();
    http.expectOne('/api/v1/store/profile').flush({ code: 'store_not_found' }, { status: 404, statusText: 'Not Found' });
    await loading;

    expect(store.status()).toBe('not-found');
    expect(store.profile()).toBeNull();
  });

  it('loja suspensa vira "unavailable"', async () => {
    const loading = store.load();
    http.expectOne('/api/v1/store/profile').flush({ code: 'store_unavailable' }, { status: 403, statusText: 'Forbidden' });
    await loading;

    expect(store.status()).toBe('unavailable');
  });

  it('falha do servidor vira "error", sem derrubar a aplicação', async () => {
    const loading = store.load();
    http.expectOne('/api/v1/store/profile').flush(null, { status: 500, statusText: 'Server Error' });
    await loading;

    expect(store.status()).toBe('error');
  });
});
