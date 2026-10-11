import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RESTAURANT } from '../../core/data/menu.data';
import { Order } from '../../core/models/order.model';
import { MenuService } from '../../core/services/menu.service';
import { PAYMENT_LABELS, customerSummary } from '../../core/services/order.service';
import { lineDetails } from '../../core/utils/pricing';
import { BrlPipe } from '../brl.pipe';

const TYPE_TICKET: Record<Order['type'], string> = {
  local: 'CONSUMO NO LOCAL',
  balcao: 'RETIRADA NO BALCÃO',
  delivery: 'DELIVERY',
};

/**
 * Comanda da cozinha (cupom de impressora térmica 80 mm).
 * Tem estilos de impressão próprios: ao chamar window.print(), só a comanda sai no papel.
 */
@Component({
  selector: 'app-kitchen-ticket',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrlPipe, DatePipe],
  templateUrl: './kitchen-ticket.component.html',
  styleUrl: './kitchen-ticket.component.scss',
})
export class KitchenTicketComponent {
  private readonly menu = inject(MenuService);

  readonly order = input.required<Order>();
  readonly restaurant = RESTAURANT;

  readonly typeLabel = computed(() => TYPE_TICKET[this.order().type]);
  readonly payment = computed(() => PAYMENT_LABELS[this.order().payment].toUpperCase());
  readonly customer = computed(() => {
    const o = this.order();
    const f = o.customer;
    if (o.type === 'local') return [`MESA: ${f.mesa}`];
    if (o.type === 'delivery') return [`CLIENTE: ${f.deliveryNome.toUpperCase()}`, `TEL: ${f.telefone}`];
    return [`CLIENTE: ${f.nome.toUpperCase()}`];
  });
  readonly address = computed(() => customerSummary(this.order().type, this.order().customer).address);

  readonly lines = computed(() =>
    this.order().lines.map(l => {
      const p = this.menu.getById(l.productId);
      return {
        key: l.key,
        qty: l.qty,
        name: (p.name + (p.size ? ' ' + p.size : '')).toUpperCase(),
        details: lineDetails(p, l).map(d => d.ticket),
        note: l.note.trim().toUpperCase(),
      };
    }),
  );
}
