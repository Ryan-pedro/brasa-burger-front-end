import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AdminSession } from '../core/session/admin-session.service';
import { CanDirective } from './can.directive';

@Component({
  imports: [CanDirective],
  template: `
    <ng-template #denied><span class="denied">sem acesso</span></ng-template>
    <button *admCan="'catalog.write'; else denied">Editar</button>
  `,
})
class Host {}

describe('CanDirective', () => {
  async function render(permissions: string[]) {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const restoring = TestBed.inject(AdminSession).restore();
    TestBed.inject(HttpTestingController)
      .expectOne('/api/v1/admin/session')
      .flush({ user: { id: '1', email: 'a@b.c', name: 'A' }, role: 'Manager', permissions });
    await restoring;

    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('mostra o conteúdo para quem tem a permissão', async () => {
    const element = await render(['catalog.write']);

    expect(element.querySelector('button')).not.toBeNull();
    expect(element.querySelector('.denied')).toBeNull();
  });

  it('mostra a alternativa para quem não tem', async () => {
    const element = await render(['catalog.read']);

    expect(element.querySelector('button')).toBeNull();
    expect(element.querySelector('.denied')?.textContent).toBe('sem acesso');
  });
});
