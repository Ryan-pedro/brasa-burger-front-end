import { Routes } from '@angular/router';
import { adminAccessGuard, signedInGuard, signedOutGuard } from './core/session/guards';
import { moduleRoutes } from './layout/admin-modules';

export const routes: Routes = [
  {
    path: 'entrar',
    title: 'Entrar',
    canActivate: [signedOutGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'sem-acesso',
    title: 'Sem acesso ao painel',
    canActivate: [signedInGuard],
    loadComponent: () => import('./features/no-access/no-access.page').then((m) => m.NoAccessPage),
  },
  {
    path: '',
    canActivate: [signedInGuard, adminAccessGuard],
    loadComponent: () => import('./layout/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', title: 'Início', loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage) },
      ...moduleRoutes(),
    ],
  },
  { path: '**', redirectTo: '' },
];
