import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminSession } from '../../core/session/admin-session.service';

/** Para quem entrou com uma conta sem permissões de painel, como a da cozinha. */
@Component({
  selector: 'adm-no-access-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="wrap">
      @if (isKitchen()) {
        <h1>Esta conta é da cozinha</h1>
        <p>
          Contas da cozinha não acessam o painel da loja. Elas vão usar o painel da cozinha,
          que ainda está em construção.
        </p>
      } @else {
        <h1>Sua conta não tem acesso ao painel</h1>
        <p>Peça ao dono da loja para revisar o seu papel na equipe.</p>
      }
      <p class="who">Conectado como {{ session.user()?.email }}</p>
      <button type="button" class="btn btn-primary" (click)="signOut()" [disabled]="signingOut()">
        {{ signingOut() ? 'Saindo…' : 'Sair e entrar com outra conta' }}
      </button>
    </main>
  `,
  styles: `
    .wrap {
      min-height: 100dvh;
      display: grid;
      align-content: center;
      justify-items: start;
      gap: 12px;
      max-width: 540px;
      margin: 0 auto;
      padding: 24px;
    }
    h1 { font-family: var(--font-display); font-weight: 400; font-size: 34px; line-height: 1.05; color: var(--ember); }
    p { color: var(--ink-2); }
    .who { font-size: 14px; color: var(--muted); margin-bottom: 8px; }
  `,
})
export class NoAccessPage {
  protected readonly session = inject(AdminSession);
  private readonly router = inject(Router);

  protected readonly isKitchen = computed(() => this.session.role() === 'Kitchen');
  protected readonly signingOut = signal(false);

  protected async signOut(): Promise<void> {
    this.signingOut.set(true);
    await this.session.signOut();
    this.signingOut.set(false);
    await this.router.navigate(['/entrar']);
  }
}
