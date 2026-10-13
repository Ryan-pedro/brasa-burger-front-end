import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminSession } from './admin-session.service';
import { safeReturnUrl } from './return-url';

/** Só passa com sessão; sem ela, vai para o login guardando o endereço pedido. */
export const signedInGuard: CanActivateFn = (_route, state) => {
  if (inject(AdminSession).signedIn()) {
    return true;
  }

  const back = safeReturnUrl(state.url);
  return inject(Router).createUrlTree(['/entrar'], { queryParams: back === '/' ? {} : { voltar: back } });
};

/** O login não faz sentido para quem já entrou. */
export const signedOutGuard: CanActivateFn = (route) => {
  if (!inject(AdminSession).signedIn()) {
    return true;
  }

  return inject(Router).parseUrl(safeReturnUrl(route.queryParamMap.get('voltar')));
};

/** Contas sem nenhuma permissão de painel (a cozinha) vão para a explicação. */
export const adminAccessGuard: CanActivateFn = () =>
  inject(AdminSession).hasAdminAccess() || inject(Router).createUrlTree(['/sem-acesso']);

/** Para os módulos: exige uma permissão específica. A API continua sendo quem decide. */
export function permissionGuard(permission: string): CanActivateFn {
  return () => inject(AdminSession).can(permission) || inject(Router).createUrlTree(['/']);
}
