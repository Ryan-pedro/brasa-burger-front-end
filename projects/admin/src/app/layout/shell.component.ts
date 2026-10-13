import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminSession } from '../core/session/admin-session.service';
import { StoreProfileService } from '../core/store/store-profile.service';
import { ADMIN_MODULES } from './admin-modules';

/** Moldura do painel: barra superior com a loja e o usuário, navegação lateral e conteúdo. */
@Component({
  selector: 'adm-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  protected readonly session = inject(AdminSession);
  protected readonly store = inject(StoreProfileService);
  private readonly router = inject(Router);

  /** Só os módulos que o papel do usuário libera. */
  protected readonly modules = computed(() => ADMIN_MODULES.filter((m) => this.session.can(m.permission)));

  protected readonly signingOut = signal(false);

  protected async signOut(): Promise<void> {
    this.signingOut.set(true);
    await this.session.signOut();
    this.signingOut.set(false);
    await this.router.navigate(['/entrar']);
  }
}
