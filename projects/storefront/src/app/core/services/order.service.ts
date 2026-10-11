import { Injectable, computed, inject, signal } from '@angular/core';
import { ORDER_STATUSES, Order, OrderType, PaymentMethod, CustomerForm } from '../models/order.model';
import { CartService } from './cart.service';
import { CheckoutService } from './checkout.service';

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  local: 'Consumir no local',
  balcao: 'Retirada no balcão',
  delivery: 'Delivery',
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: 'Cartão',
  pix: 'Pix',
  cash: 'Dinheiro',
};

/** Texto de identificação do cliente conforme o tipo de pedido. */
export function customerSummary(type: OrderType, f: CustomerForm) {
  if (type === 'local') return { who: `Mesa ${f.mesa}`, address: '' };
  if (type === 'delivery') {
    return {
      who: `${f.deliveryNome} · ${f.telefone}`,
      address: `${f.rua}, ${f.numero}${f.complemento ? ' — ' + f.complemento : ''} · ${f.bairro}`,
    };
  }
  return { who: f.nome, address: '' };
}

/**
 * Pedido confirmado e acompanhamento de status.
 * Ao integrar: `confirm()` fará POST /api/pedidos; o backend gera o número,
 * envia a comanda para a impressora da cozinha e notifica mudanças de status
 * (ex.: SignalR), substituindo `advanceStatus()`.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly cart = inject(CartService);
  private readonly checkout = inject(CheckoutService);
  private nextNumber = 1048;

  readonly current = signal<Order | null>(null);
  readonly statuses = ORDER_STATUSES;
  readonly isFinished = computed(() => (this.current()?.status ?? 0) >= ORDER_STATUSES.length - 1);

  confirm(): Order {
    const order: Order = {
      number: this.nextNumber++,
      createdAt: new Date(),
      lines: this.cart.lines(),
      type: this.checkout.type(),
      customer: { ...this.checkout.form() },
      totals: this.checkout.totals(),
      payment: this.checkout.payment(),
      status: 1,
    };
    this.current.set(order);
    this.cart.clear();
    return order;
  }

  /** Simulação de avanço de status para a demonstração. */
  advanceStatus(): void {
    this.current.update(o => (o ? { ...o, status: Math.min(o.status + 1, ORDER_STATUSES.length - 1) } : o));
  }

  resetStatus(): void {
    this.current.update(o => (o ? { ...o, status: 1 } : o));
  }
}
