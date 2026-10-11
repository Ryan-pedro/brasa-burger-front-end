import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PaymentMethod } from '../../core/models/order.model';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { ORDER_TYPE_LABELS, OrderService, PAYMENT_LABELS, customerSummary } from '../../core/services/order.service';
import { CartLineComponent } from '../../shared/cart-line.component';
import { IconComponent } from '../../shared/icon.component';
import { FlowHeaderComponent } from '../../shared/layout/flow-header.component';
import { OrderSummaryComponent } from '../../shared/order-summary.component';

@Component({
  selector: 'app-checkout-review-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CartLineComponent, IconComponent, FlowHeaderComponent, OrderSummaryComponent],
  template: `
    <app-flow-header title="Confira seu pedido" backTo="/pedido/tipo" [step]="2" />

    <div class="container-narrow page screen-in">
      <section class="card block">
        <div class="block-head">
          <h2>Itens</h2>
          <a routerLink="/carrinho" class="link-btn">EDITAR</a>
        </div>
        @for (l of cart.lines(); track l.key) {
          <app-cart-line [line]="l" [editable]="false" />
        }
      </section>

      <div class="two">
        <div class="card info"><span class="info-label">Tipo de pedido</span><strong>{{ typeLabel() }}</strong></div>
        <div class="card info"><span class="info-label">Cliente</span><strong>{{ customer().who }}</strong></div>
      </div>
      @if (customer().address) {
        <div class="card info"><span class="info-label">Entregar em</span><span>{{ customer().address }}</span></div>
      }

      <section class="card block">
        <h2>Pagamento <small class="muted">· na entrega ou retirada</small></h2>
        <div class="pay" role="radiogroup" aria-label="Forma de pagamento">
          @for (p of payments; track p.id) {
            <button type="button" role="radio" class="pay-opt" [class.is-on]="checkout.payment() === p.id"
                    [attr.aria-checked]="checkout.payment() === p.id" (click)="checkout.payment.set(p.id)">{{ p.label }}</button>
          }
        </div>
      </section>

      <app-order-summary heading="Resumo financeiro" [totals]="checkout.totals()"
                         [feeLabel]="checkout.type() === 'delivery' ? 'Taxa de entrega' : 'Taxa'" />

      <button type="button" class="btn btn-primary btn-lg btn-block" (click)="confirm()">
        <app-icon name="check" [stroke]="2.6" />Confirmar pedido
      </button>
      <a routerLink="/carrinho" class="btn btn-outline btn-block">Voltar e editar pedido</a>
    </div>
  `,
  styles: `
    :host { display: block; }
    .page { padding-top: 20px; padding-bottom: 40px; display: flex; flex-direction: column; gap: 14px; }
    .block { padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; border-radius: 24px; }
    .block h2 { font-size: 17px; font-weight: 900; }
    .block h2 small { font-weight: 600; font-size: 14px; }
    .block-head { display: flex; justify-content: space-between; align-items: center; }
    .two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .info { padding: 16px; border-radius: 20px; display: flex; flex-direction: column; gap: 4px; }
    .info strong { font-size: 16px; }
    .info-label { font-size: 12px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
    .pay { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .pay-opt { height: 52px; border-radius: 999px; border: 2px solid var(--line); background: var(--white); font-weight: 900; font-size: 15px; }
    .pay-opt.is-on { border-color: var(--red); background: var(--selected-bg); }
  `,
})
export class CheckoutReviewPage {
  readonly cart = inject(CartService);
  readonly checkout = inject(CheckoutService);
  private readonly orders = inject(OrderService);
  private readonly router = inject(Router);

  readonly payments = (Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map(id => ({ id, label: PAYMENT_LABELS[id] }));
  readonly typeLabel = computed(() => ORDER_TYPE_LABELS[this.checkout.type()]);
  readonly customer = computed(() => customerSummary(this.checkout.type(), this.checkout.form()));

  confirm(): void {
    this.orders.confirm();
    this.router.navigate(['/pedido/confirmado'], { replaceUrl: true });
  }
}
