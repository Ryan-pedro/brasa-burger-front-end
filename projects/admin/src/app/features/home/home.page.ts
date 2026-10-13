import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AdminSession } from '../../core/session/admin-session.service';
import { ADMIN_MODULES } from '../../layout/admin-modules';
import { firstName, greetingFor } from './greeting';

@Component({
  selector: 'adm-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>{{ greeting }}, {{ name() }}.</h1>
    <p class="role">Você entrou como <strong>{{ session.roleLabel().toLowerCase() }}</strong>.</p>

    <h2>O que você vai encontrar aqui</h2>
    <ul class="modules">
      @for (module of modules(); track module.permission) {
        <li>
          <span class="name">{{ module.label }}</span>
          <span class="desc">{{ module.description }}</span>
          @if (!module.path) {
            <span class="state">em breve</span>
          }
        </li>
      }
    </ul>
  `,
  styles: `
    :host { display: block; max-width: 760px; }
    h1 { font-size: clamp(28px, 3.4vw, 36px); font-weight: 800; line-height: 1.15; letter-spacing: -.01em; }
    .role { margin-top: 6px; color: var(--ink-2); }
    .role strong { color: var(--ink); }
    h2 { margin-top: 36px; font-size: 17px; font-weight: 800; }
    .modules { list-style: none; margin: 12px 0 0; padding: 0; border-top: 1px solid var(--line); }
    li {
      display: grid;
      grid-template-columns: 120px 1fr auto;
      align-items: baseline;
      gap: 4px 16px;
      padding: 14px 4px;
      border-bottom: 1px solid var(--line);
    }
    .name { font-weight: 800; }
    .desc { color: var(--ink-2); }
    .state { font-size: 13px; font-weight: 700; color: var(--muted); white-space: nowrap; }
    @media (max-width: 599px) {
      li { grid-template-columns: 1fr auto; }
      .desc { grid-column: 1 / -1; grid-row: 2; }
    }
  `,
})
export class HomePage {
  protected readonly session = inject(AdminSession);

  protected readonly greeting = greetingFor(new Date().getHours());
  protected readonly name = computed(() => firstName(this.session.user()?.name));
  protected readonly modules = computed(() => ADMIN_MODULES.filter((m) => this.session.can(m.permission)));
}
