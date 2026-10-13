import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import { permissionGuard } from '../core/session/guards';
import { Permission } from '../core/session/permissions';

export interface AdminModule {
  path: string;
  label: string;
  description: string;
  permission: Permission;
  loadComponent?: () => Promise<Type<unknown>>;
}

export const ADMIN_MODULES: readonly AdminModule[] = [
  { path: 'pedidos', label: 'Pedidos', description: 'Pedidos em andamento e histórico do dia.', permission: Permission.OrdersRead },
  {
    path: 'cardapio',
    label: 'Cardápio',
    description: 'Produtos, preços e o que está em falta.',
    permission: Permission.CatalogRead,
    loadComponent: () => import('../features/catalog/catalog.page').then((m) => m.CatalogPage),
  },
  { path: 'ofertas', label: 'Ofertas', description: 'Promoções e combos com desconto.', permission: Permission.OffersWrite },
  { path: 'loja', label: 'Loja', description: 'Nome, horários, tipos de pedido e taxa de entrega.', permission: Permission.StoreSettings },
  { path: 'impressao', label: 'Impressão', description: 'Impressoras da cozinha e teste de comanda.', permission: Permission.PrintingManage },
  { path: 'equipe', label: 'Equipe', description: 'Quem acessa o painel e a cozinha, e com qual papel.', permission: Permission.TeamManage },
];

export function moduleRoutes(modules: readonly AdminModule[] = ADMIN_MODULES): Routes {
  return modules
    .filter((module) => module.loadComponent)
    .map((module) => ({
      path: module.path,
      title: module.label,
      canActivate: [permissionGuard(module.permission)],
      loadComponent: module.loadComponent,
    }));
}
