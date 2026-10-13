/** Permissões devolvidas pela API em GET /api/v1/admin/session (espelho de Permissions.cs). */
export const Permission = {
  OrdersRead: 'orders.read',
  OrdersManage: 'orders.manage',
  CatalogRead: 'catalog.read',
  CatalogWrite: 'catalog.write',
  OffersWrite: 'offers.write',
  StoreSettings: 'store.settings',
  PrintingManage: 'printing.manage',
  TeamManage: 'team.manage',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

/** Basta uma destas para o usuário ter o que fazer no painel. A cozinha não tem nenhuma. */
export const ADMIN_PERMISSIONS: readonly string[] = Object.values(Permission);
