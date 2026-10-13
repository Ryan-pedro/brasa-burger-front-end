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

export const ADMIN_PERMISSIONS: readonly string[] = Object.values(Permission);
