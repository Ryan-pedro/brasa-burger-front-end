import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminSession } from './admin-session.service';
import { AdminSessionData } from './session.model';

const owner: AdminSessionData = {
  user: { id: '1', email: 'dono@brasa.dev', name: 'Ana Dono' },
  role: 'Owner',
  permissions: ['orders.read', 'catalog.read', 'team.manage'],
};

const kitchen: AdminSessionData = {
  user: { id: '2', email: 'cozinha@brasa.dev', name: 'Cozinha' },
  role: 'Kitchen',
  permissions: ['kitchen.tickets.read'],
};

describe('AdminSession', () => {
  let session: AdminSession;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    session = TestBed.inject(AdminSession);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('começa sem saber se há sessão', () => {
    expect(session.status()).toBe('checking');
    expect(session.user()).toBeNull();
  });

  it('restaura uma sessão válida', async () => {
    const restoring = session.restore();
    http.expectOne('/api/v1/admin/session').flush(owner);
    await restoring;

    expect(session.status()).toBe('signed-in');
    expect(session.user()?.name).toBe('Ana Dono');
    expect(session.roleLabel()).toBe('Dono');
    expect(session.can('team.manage')).toBe(true);
    expect(session.can('printing.manage')).toBe(false);
    expect(session.hasAdminAccess()).toBe(true);
  });

  it('401 na restauração significa "não entrou"', async () => {
    const restoring = session.restore();
    http.expectOne('/api/v1/admin/session').flush({ code: 'session_expired' }, { status: 401, statusText: 'Unauthorized' });
    await restoring;

    expect(session.status()).toBe('signed-out');
  });

  it('API fora do ar vira "unreachable", sem rejeitar', async () => {
    const restoring = session.restore();
    http.expectOne('/api/v1/admin/session').error(new ProgressEvent('error'));
    await restoring;

    expect(session.status()).toBe('unreachable');
  });

  it('entra com e-mail e senha', async () => {
    const signingIn = session.signIn('dono@brasa.dev', 'brasa-dev-1234');
    const request = http.expectOne('/api/v1/admin/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'dono@brasa.dev', password: 'brasa-dev-1234' });
    request.flush(owner);

    expect(await signingIn).toEqual({ ok: true });
    expect(session.status()).toBe('signed-in');
  });

  it('devolve o código do erro quando o login falha', async () => {
    const signingIn = session.signIn('dono@brasa.dev', 'errada');
    http
      .expectOne('/api/v1/admin/auth/login')
      .flush({ title: 'E-mail ou senha inválidos.', code: 'invalid_credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(await signingIn).toEqual({ ok: false, code: 'invalid_credentials' });
    expect(session.signedIn()).toBe(false);
  });

  it('sem resposta do servidor, o código é network_error', async () => {
    const signingIn = session.signIn('dono@brasa.dev', 'x');
    http.expectOne('/api/v1/admin/auth/login').error(new ProgressEvent('error'));

    expect(await signingIn).toEqual({ ok: false, code: 'network_error' });
  });

  it('a conta da cozinha entra, mas não tem acesso ao painel', async () => {
    const signingIn = session.signIn('cozinha@brasa.dev', 'x');
    http.expectOne('/api/v1/admin/auth/login').flush(kitchen);
    await signingIn;

    expect(session.signedIn()).toBe(true);
    expect(session.hasAdminAccess()).toBe(false);
  });

  it('sair esquece o usuário mesmo se a API falhar', async () => {
    const signingIn = session.signIn('dono@brasa.dev', 'x');
    http.expectOne('/api/v1/admin/auth/login').flush(owner);
    await signingIn;

    const signingOut = session.signOut();
    http.expectOne('/api/v1/admin/auth/logout').flush(null, { status: 500, statusText: 'Server Error' });
    await signingOut;

    expect(session.status()).toBe('signed-out');
    expect(session.user()).toBeNull();
  });
});
