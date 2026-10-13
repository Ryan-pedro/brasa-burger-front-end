import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CSRF_HEADER, csrfInterceptor } from './csrf.interceptor';

describe('csrfInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([csrfInterceptor])), provideHttpClientTesting()],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('acrescenta o cabeçalho em POST para a API', () => {
    client.post('/api/v1/admin/auth/logout', null).subscribe();
    const request = http.expectOne('/api/v1/admin/auth/logout');

    expect(request.request.headers.get(CSRF_HEADER)).toBe('1');
    request.flush(null);
  });

  it('não acrescenta em GET', () => {
    client.get('/api/v1/admin/session').subscribe();
    const request = http.expectOne('/api/v1/admin/session');

    expect(request.request.headers.has(CSRF_HEADER)).toBe(false);
    request.flush({});
  });

  it('não envia o cabeçalho para fora da API', () => {
    client.post('https://exemplo.com/coleta', {}).subscribe();
    const request = http.expectOne('https://exemplo.com/coleta');

    expect(request.request.headers.has(CSRF_HEADER)).toBe(false);
    request.flush(null);
  });
});
