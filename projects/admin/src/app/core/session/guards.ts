import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminSession } from './admin-session.service';
import { safeReturnUrl } from './return-url';

export const signedInGuard: CanActivateFn = (_route, state) => {
  if (inject(AdminSession).signedIn()) {
    return true;
  }

  const back = safeReturnUrl(state.url);
  return inject(Router).createUrlTree(['/entrar'], { queryParams: back === '/' ? {} : { voltar: back } });
};

export const signedOutGuard: CanActivateFn = (route) => {
  if (!inject(AdminSession).signedIn()) {
    return true;
  }

  return inject(Router).parseUrl(safeReturnUrl(route.queryParamMap.get('voltar')));
};

export const adminAccessGuard: CanActivateFn = () =>
  inject(AdminSession).hasAdminAccess() || inject(Router).createUrlTree(['/sem-acesso']);

export function permissionGuard(permission: string): CanActivateFn {
  return () => inject(AdminSession).can(permission) || inject(Router).createUrlTree(['/']);
}
