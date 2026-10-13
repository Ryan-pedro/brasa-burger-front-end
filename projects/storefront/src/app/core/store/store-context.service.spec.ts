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

  it('carrega o perfil da loja', async () => {
    const loading = store.load();
    const request = http.expectOne('/api/v1/store/profile');

    expect(request.request.method).toBe('GET');
    request.flush({ name: 'Brasa Burger', timeZoneId: 'America/Sao_Paulo' });
    await loading;

    expect(store.status()).toBe('ready');
    expect(store.name()).toBe('Brasa Burger');
  });

  it('falha da API vira "error", sem derrubar a aplicação', async () => {
    const loading = store.load();
    http.expectOne('/api/v1/store/profile').flush(null, { status: 503, statusText: 'Service Unavailable' });
    await loading;

    expect(store.status()).toBe('error');
    expect(store.profile()).toBeNull();
  });

  it('pode tentar de novo depois de uma falha', async () => {
    const first = store.load();
    http.expectOne('/api/v1/store/profile').flush(null, { status: 500, statusText: 'Server Error' });
    await first;

    const second = store.load();
    http.expectOne('/api/v1/store/profile').flush({ name: 'Brasa Burger', timeZoneId: 'America/Sao_Paulo' });
    await second;

    expect(store.status()).toBe('ready');
  });
});
