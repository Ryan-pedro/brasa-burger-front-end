import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';

/** Só entra no checkout com itens no carrinho. */
export const hasItemsGuard: CanActivateFn = () =>
  !inject(CartService).isEmpty() || inject(Router).createUrlTree(['/carrinho']);

/** Telas de pedido confirmado/acompanhamento exigem um pedido feito. */
export const hasOrderGuard: CanActivateFn = () =>
  !!inject(OrderService).current() || inject(Router).createUrlTree(['/']);
