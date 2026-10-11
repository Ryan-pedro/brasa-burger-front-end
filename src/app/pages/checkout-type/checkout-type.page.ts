import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RESTAURANT } from '../../core/data/menu.data';
import { CustomerForm, OrderType } from '../../core/models/order.model';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { BrlPipe } from '../../shared/brl.pipe';
import { IconComponent, IconName } from '../../shared/icon.component';
import { FlowHeaderComponent } from '../../shared/layout/flow-header.component';

@Component({
  selector: 'app-checkout-type-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrlPipe, IconComponent, FlowHeaderComponent],
  templateUrl: './checkout-type.page.html',
  styleUrl: './checkout-type.page.scss',
})
export class CheckoutTypePage {
  readonly checkout = inject(CheckoutService);
  readonly cart = inject(CartService);
  private readonly router = inject(Router);

  readonly options: { id: OrderType; title: string; desc: string; icon: IconName }[] = [
    { id: 'local', title: 'Consumir no local', desc: 'Levamos até a sua mesa', icon: 'utensils' },
    { id: 'balcao', title: 'Retirada no balcão', desc: 'Chamamos pelo seu nome', icon: 'bag' },
    { id: 'delivery', title: 'Delivery', desc: `Entrega em 35–50 min · R$ ${RESTAURANT.deliveryFee.toFixed(2).replace('.', ',')}`, icon: 'scooter' },
  ];

  set(field: keyof CustomerForm, e: Event): void {
    this.checkout.setField(field, (e.target as HTMLInputElement).value);
  }

  next(): void {
    if (this.checkout.isValid()) this.router.navigate(['/pedido/revisao']);
  }
}
