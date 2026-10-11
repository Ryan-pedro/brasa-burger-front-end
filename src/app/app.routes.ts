import { Routes } from '@angular/router';
import { hasItemsGuard, hasOrderGuard } from './core/guards';

export const routes: Routes = [
  { path: '', title: 'Brasa Burger', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: 'cardapio', title: 'Cardápio · Brasa Burger', loadComponent: () => import('./pages/menu/menu.page').then(m => m.MenuPage) },
  { path: 'bebidas', title: 'Bebidas · Brasa Burger', loadComponent: () => import('./pages/drinks/drinks.page').then(m => m.DrinksPage) },
  { path: 'promocoes', title: 'Promoções · Brasa Burger', loadComponent: () => import('./pages/promos/promos.page').then(m => m.PromosPage) },
  { path: 'carrinho', title: 'Carrinho · Brasa Burger', loadComponent: () => import('./pages/cart/cart.page').then(m => m.CartPage) },

  // Checkout
  { path: 'pedido/tipo', title: 'Tipo de pedido', canActivate: [hasItemsGuard],
    loadComponent: () => import('./pages/checkout-type/checkout-type.page').then(m => m.CheckoutTypePage) },
  { path: 'pedido/revisao', title: 'Confira seu pedido', canActivate: [hasItemsGuard],
    loadComponent: () => import('./pages/checkout-review/checkout-review.page').then(m => m.CheckoutReviewPage) },
  { path: 'pedido/confirmado', title: 'Pedido confirmado', canActivate: [hasOrderGuard],
    loadComponent: () => import('./pages/order-confirmed/order-confirmed.page').then(m => m.OrderConfirmedPage) },
  { path: 'pedido/acompanhar', title: 'Acompanhar pedido', canActivate: [hasOrderGuard],
    loadComponent: () => import('./pages/order-tracking/order-tracking.page').then(m => m.OrderTrackingPage) },

  // Visão da cozinha
  { path: 'cozinha/comanda', title: 'Comanda da cozinha',
    loadComponent: () => import('./pages/kitchen/kitchen.page').then(m => m.KitchenPage) },

  { path: '**', redirectTo: '' },
];
