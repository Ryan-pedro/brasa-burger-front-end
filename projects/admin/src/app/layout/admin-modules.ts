import { Permission } from '../core/session/permissions';

/** Um módulo do painel e a permissão que o libera. */
export interface AdminModule {
  label: string;
  description: string;
  permission: Permission;
  /** Rota do módulo; sem rota, ainda está em construção. */
  path?: string;
}

/** Na ordem em que aparecem na navegação. */
export const ADMIN_MODULES: readonly AdminModule[] = [
  { label: 'Pedidos', description: 'Pedidos em andamento e histórico do dia.', permission: Permission.OrdersRead },
  { label: 'Cardápio', description: 'Produtos, preços, adicionais e o que está em falta.', permission: Permission.CatalogRead },
  { label: 'Ofertas', description: 'Promoções e combos com desconto.', permission: Permission.OffersWrite },
  { label: 'Loja', description: 'Nome, horários, tipos de pedido e taxa de entrega.', permission: Permission.StoreSettings },
  { label: 'Impressão', description: 'Impressoras da cozinha e teste de comanda.', permission: Permission.PrintingManage },
  { label: 'Equipe', description: 'Quem acessa o painel e a cozinha, e com qual papel.', permission: Permission.TeamManage },
];
