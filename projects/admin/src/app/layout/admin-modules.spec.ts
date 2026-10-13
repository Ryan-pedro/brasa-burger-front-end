import { Component } from '@angular/core';
import { Permission } from '../core/session/permissions';
import { AdminModule, moduleRoutes } from './admin-modules';

@Component({ template: '' })
class Page {}

describe('moduleRoutes', () => {
  const modules: AdminModule[] = [
    { path: 'pronto', label: 'Pronto', description: '', permission: Permission.CatalogRead, loadComponent: async () => Page },
    { path: 'futuro', label: 'Futuro', description: '', permission: Permission.TeamManage },
  ];

  it('cria rota só para módulos com tela, protegida pela permissão', () => {
    const routes = moduleRoutes(modules);

    expect(routes.map((route) => route.path)).toEqual(['pronto']);
    expect(routes[0].title).toBe('Pronto');
    expect(routes[0].canActivate).toHaveLength(1);
  });
});
