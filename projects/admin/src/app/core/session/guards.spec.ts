import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap, provideRouter } from '@angular/router';
import { AdminSession } from './admin-session.service';
import { adminAccessGuard, permissionGuard, signedInGuard, signedOutGuard } from './guards';
import { AdminSessionData } from './session.model';

const manager: AdminSessionData = {
  user: { id: '1', email: 'gerente@brasa.dev', name: 'Gerente' },
  role: 'Manager',
  permissions: ['orders.read', 'catalog.read'],
};

const kitchen: AdminSessionData = { ...manager, role: 'Kitchen', permissions: ['kitchen.tickets.read'] };

describe('guards do painel', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    router = TestBed.inject(Router);
  });

  async function signInAs(data: AdminSessionData | null): Promise<void> {
    const session = TestBed.inject(AdminSession);
    const http = TestBed.inject(HttpTestingController);
    const restoring = session.restore();
    const request = http.expectOne('/api/v1/admin/session');
    if (data) {
      request.flush(data);
    } else {
      request.flush(null, { status: 401, statusText: 'Unauthorized' });
    }
    await restoring;
  }

  function route(query: Record<string, string> = {}): ActivatedRouteSnapshot {
    return { queryParamMap: convertToParamMap(query) } as ActivatedRouteSnapshot;
  }

  function state(url: string): RouterStateSnapshot {
    return { url } as RouterStateSnapshot;
  }

  function run<T>(guard: () => T): T {
    return TestBed.runInInjectionContext(guard);
  }

  function serialize(result: unknown): string {
    return result instanceof UrlTree ? router.serializeUrl(result) : String(result);
  }

  it('sem sessão, manda para o login guardando o endereço', async () => {
    await signInAs(null);

    expect(serialize(run(() => signedInGuard(route(), state('/pedidos'))))).toBe('/entrar?voltar=%2Fpedidos');
    expect(serialize(run(() => signedInGuard(route(), state('/'))))).toBe('/entrar');
  });

  it('com sessão, deixa passar', async () => {
    await signInAs(manager);

    expect(run(() => signedInGuard(route(), state('/')))).toBe(true);
  });

  it('quem já entrou não vê o login e volta para onde ia', async () => {
    await signInAs(manager);

    expect(serialize(run(() => signedOutGuard(route({ voltar: '/pedidos' }), state('/entrar'))))).toBe('/pedidos');
    expect(serialize(run(() => signedOutGuard(route({ voltar: '//outro-site.com' }), state('/entrar'))))).toBe('/');
  });

  it('a cozinha vai para a tela de sem acesso', async () => {
    await signInAs(kitchen);

    expect(serialize(run(() => adminAccessGuard(route(), state('/'))))).toBe('/sem-acesso');
  });

  it('módulo sem a permissão volta para o início', async () => {
    await signInAs(manager);

    expect(run(() => permissionGuard('orders.read')(route(), state('/pedidos')))).toBe(true);
    expect(serialize(run(() => permissionGuard('team.manage')(route(), state('/equipe'))))).toBe('/');
  });
});
