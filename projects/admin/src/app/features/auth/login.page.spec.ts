import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let http: HttpTestingController;

  async function setup(inputs: Record<string, string> = {}) {
    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(LoginPage);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;

    const type = (selector: string, value: string) => {
      const input = element.querySelector<HTMLInputElement>(selector)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const settle = async () => {
      await new Promise((resolve) => setTimeout(resolve));
      await fixture.whenStable();
    };
    const submit = async () => {
      element.querySelector<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    };

    return { fixture, element, type, submit, settle };
  }

  afterEach(() => http.verify());

  it('não chama a API com campos vazios e aponta o que falta', async () => {
    const { element, submit } = await setup();

    await submit();

    expect(element.querySelector('#email-error')?.textContent).toContain('Informe seu e-mail.');
    expect(element.querySelector('#password-error')?.textContent).toContain('Informe sua senha.');
    http.expectNone('/api/v1/admin/auth/login');
  });

  it('mostra a mensagem certa para senha errada e limpa a senha', async () => {
    const { element, type, submit, settle } = await setup();
    type('#email', 'dono@brasa.dev');
    type('#password', 'errada');

    await submit();
    http
      .expectOne('/api/v1/admin/auth/login')
      .flush({ code: 'invalid_credentials' }, { status: 401, statusText: 'Unauthorized' });
    await settle();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('E-mail ou senha não conferem');
    expect(element.querySelector<HTMLInputElement>('#password')!.value).toBe('');
  });

  it('avisa sobre o bloqueio por excesso de tentativas', async () => {
    const { element, type, submit, settle } = await setup();
    type('#email', 'dono@brasa.dev');
    type('#password', 'errada');

    await submit();
    http.expectOne('/api/v1/admin/auth/login').flush({ code: 'account_locked' }, { status: 403, statusText: 'Forbidden' });
    await settle();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('bloqueado por 15 minutos');
  });

  it('depois de entrar, volta para o endereço pedido', async () => {
    const { type, submit, settle } = await setup({ voltar: '/pedidos' });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    type('#email', 'dono@brasa.dev');
    type('#password', 'brasa-dev-1234');

    await submit();
    http.expectOne('/api/v1/admin/auth/login').flush({
      user: { id: '1', email: 'dono@brasa.dev', name: 'Dono' },
      role: 'Owner',
      permissions: ['orders.read'],
    });
    await settle();

    expect(navigate).toHaveBeenCalledWith('/pedidos');
  });

  it('avisa quando a sessão anterior terminou', async () => {
    const { element } = await setup({ motivo: 'sessao' });

    expect(element.querySelector('[role="status"]')?.textContent).toContain('Sua sessão terminou');
  });
});
