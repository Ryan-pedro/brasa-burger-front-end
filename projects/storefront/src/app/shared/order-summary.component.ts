import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CartTotals } from '../core/models/order.model';
import { BrlPipe } from './brl.pipe';

/** Bloco "Resumo": subtotal, desconto, taxa e total. */
@Component({
  selector: 'app-order-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrlPipe],
  template: `
    <section class="card summary">
      <h2 class="heading">{{ heading() }}</h2>
      <div class="row"><span>Subtotal</span><span>{{ totals().subtotal | brl }}</span></div>
      @if (totals().discount > 0) {
        <div class="row discount"><span>Desconto · {{ totals().discountLabel }}</span><span>- {{ totals().discount | brl }}</span></div>
      }
      <div class="row"><span>{{ feeLabel() }}</span><span>{{ totals().fee | brl }}</span></div>
      <hr class="divider">
      <div class="row total"><span>Total</span><span class="price">{{ totals().total | brl }}</span></div>
    </section>
  `,
  styles: `
    .summary { padding: 20px; display: flex; flex-direction: column; gap: 10px; border-radius: 24px; }
    .heading { font-size: 17px; font-weight: 900; margin-bottom: 4px; }
    .row { display: flex; justify-content: space-between; gap: 12px; font-size: 15px; color: var(--muted-2); }
    .discount { color: var(--success); font-weight: 700; }
    .row span:last-child { white-space: nowrap; }
    .total { align-items: baseline; color: var(--ink); font-size: 17px; font-weight: 900; }
    .total .price { font-size: 28px; }
  `,
})
export class OrderSummaryComponent {
  readonly totals = input.required<CartTotals>();
  readonly heading = input('Resumo');
  readonly feeLabel = input('Taxa');
}
