import { Injectable, computed, inject, signal } from '@angular/core';
import { CustomerForm, OrderType, PaymentMethod } from '../models/order.model';
import { computeTotals } from '../utils/pricing';
import { CartService } from './cart.service';
import { MenuService } from './menu.service';

/**
 * Dados do checkout: tipo de pedido, dados do cliente e forma de pagamento.
 * Os valores iniciais são exemplos para agilizar a demonstração.
 */
@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly cart = inject(CartService);
  private readonly menu = inject(MenuService);

  readonly type = signal<OrderType>('balcao');
  readonly payment = signal<PaymentMethod>('card');
  readonly form = signal<CustomerForm>({
    mesa: '12',
    nome: 'Ryan',
    deliveryNome: 'Ryan',
    telefone: '(31) 98765-4321',
    rua: 'Rua das Palmeiras',
    numero: '250',
    complemento: 'Apto 302',
    bairro: 'Funcionários',
  });

  readonly totals = computed(() =>
    computeTotals(this.cart.lines(), id => this.menu.getById(id), this.type()),
  );

  /** Valida apenas os campos exigidos pelo tipo de pedido escolhido. */
  readonly isValid = computed(() => {
    const f = this.form();
    const ok = (v: string) => v.trim().length > 0;
    switch (this.type()) {
      case 'local': return ok(f.mesa);
      case 'delivery': return ok(f.deliveryNome) && ok(f.telefone) && ok(f.rua) && ok(f.numero) && ok(f.bairro);
      default: return ok(f.nome);
    }
  });

  setField<K extends keyof CustomerForm>(field: K, value: string): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }
}
