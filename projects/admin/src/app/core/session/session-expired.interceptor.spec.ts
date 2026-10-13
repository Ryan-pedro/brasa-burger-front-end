import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AdminSession } from './admin-session.service';
import { sessionExpiredInterceptor } from './session-expired.interceptor';

describe('sessionExpiredInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let session: AdminSession;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([sessionExpiredInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    session = TestBed.inject(AdminSession);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const restoring = session.restore();
    http.expectOne('/api/v1/admin/session').flush({
      user: { id: '1', email: 'dono@brasa.dev', name: 'Dono' },
      role: 'Owner',
      permissions: ['orders.read'],
    });
    await restoring;
  });

  afterEach(() => http.verify());

  it('401 no meio do uso encerra a sessão e leva ao login', () => {
    client.get('/api/v1/admin/orders').subscribe({ error: () => undefined });
    http.expectOne('/api/v1/admin/orders').flush({ code: 'session_expired' }, { status: 401, statusText: 'Unauthorized' });

    expect(session.status()).toBe('signed-out');
    expect(navigate).toHaveBeenCalledWith(['/entrar'], { queryParams: { motivo: 'sessao' } });
  });

  it('401 do próprio login não derruba nada', () => {
    client.post('/api/v1/admin/auth/login', {}).subscribe({ error: () => undefined });
    http.expectOne('/api/v1/admin/auth/login').flush({ code: 'invalid_credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(session.status()).toBe('signed-in');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('403 não encerra a sessão', () => {
    client.get('/api/v1/admin/team').subscribe({ error: () => undefined });
    http.expectOne('/api/v1/admin/team').flush({ code: 'forbidden' }, { status: 403, statusText: 'Forbidden' });

    expect(session.status()).toBe('signed-in');
  });
});
