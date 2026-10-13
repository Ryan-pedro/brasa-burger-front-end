import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NETWORK_ERROR } from '../../core/api/api-problem';
import { AdminSession } from '../../core/session/admin-session.service';
import { safeReturnUrl } from '../../core/session/return-url';
import { StoreProfileService } from '../../core/store/store-profile.service';

/** O que dizer para cada código de erro da API. */
const LOGIN_ERRORS: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha não conferem. Confira e tente de novo.',
  account_locked: 'Muitas tentativas erradas seguidas. Por segurança, o acesso fica bloqueado por 15 minutos.',
  account_disabled: 'Este usuário está desativado. Peça ao dono da loja para reativá-lo.',
  [NETWORK_ERROR]: 'O servidor não respondeu. Confira a conexão e tente de novo.',
};

const FALLBACK_ERROR = 'Não foi possível entrar agora. Tente de novo em instantes.';

@Component({
  selector: 'adm-login-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly session = inject(AdminSession);
  private readonly router = inject(Router);
  protected readonly store = inject(StoreProfileService);

  /** Preenchidos pela URL: ?voltar=/pedidos&motivo=sessao */
  readonly voltar = input<string>();
  readonly motivo = input<string>();

  private readonly passwordInput = viewChild.required<ElementRef<HTMLInputElement>>('passwordInput');

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected readonly submitting = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly sessionEnded = computed(() => this.motivo() === 'sessao' && !this.errorMessage());

  protected fieldInvalid(name: 'email' | 'password'): boolean {
    return this.submitted() && this.form.controls[name].invalid;
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    this.errorMessage.set(null);

    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    const { email, password } = this.form.getRawValue();
    const result = await this.session.signIn(email.trim(), password);
    this.submitting.set(false);

    if (result.ok) {
      await this.router.navigateByUrl(safeReturnUrl(this.voltar()));
      return;
    }

    this.errorMessage.set(LOGIN_ERRORS[result.code] ?? FALLBACK_ERROR);

    if (result.code === 'invalid_credentials') {
      this.form.controls.password.reset();
      this.submitted.set(false);
      this.passwordInput().nativeElement.focus();
    }
  }
}
