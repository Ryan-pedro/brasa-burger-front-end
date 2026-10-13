import { computed, inject } from '@angular/core';
import { AdminSession } from '../core/session/admin-session.service';
import { ADMIN_MODULES } from './admin-modules';

export function allowedModules() {
  const session = inject(AdminSession);
  return computed(() => ADMIN_MODULES.filter((module) => session.can(module.permission)));
}
