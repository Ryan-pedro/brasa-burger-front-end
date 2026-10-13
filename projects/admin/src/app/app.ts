import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSession } from './core/session/admin-session.service';

@Component({
  selector: 'adm-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (session.status() === 'unreachable') {
      <main class="unreachable">
        <h1>O painel não conseguiu falar com o servidor</h1>
        <p>Sem resposta, não dá para saber se você já entrou. Confira a conexão e tente de novo.</p>
        <button type="button" class="btn btn-primary" (click)="retry()">Tentar de novo</button>
      </main>
    } @else {
      <router-outlet />
    }
  `,
  styles: `
    .unreachable {
      min-height: 100dvh;
      display: grid;
      align-content: center;
      justify-items: start;
      gap: 12px;
      max-width: 520px;
      margin: 0 auto;
      padding: 24px;
    }
    h1 { font-family: var(--font-display); font-weight: 400; font-size: 30px; line-height: 1.1; color: var(--ember); }
    p { color: var(--ink-2); margin-bottom: 8px; }
  `,
})
export class App {
  protected readonly session = inject(AdminSession);

  protected retry(): void {
    window.location.reload();
  }
}
