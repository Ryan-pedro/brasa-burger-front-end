import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MENU_SLUGS } from '../../core/data/menu.data';
import { Product } from '../../core/models/menu.model';
import { CartLine, Order } from '../../core/models/order.model';
import { MenuService } from '../../core/services/menu.service';
import { computeTotals } from '../../core/utils/pricing';
import { OrderService } from '../../core/services/order.service';
import { IconComponent } from '../../shared/icon.component';
import { KitchenTicketComponent } from '../../shared/kitchen-ticket/kitchen-ticket.component';

function sampleOrder(menu: MenuService): Order {
  const picks = [menu.byCategory(MENU_SLUGS.burgers)[0], menu.byCategory(MENU_SLUGS.sides)[0], menu.drinks()[0]]
    .filter((p): p is Product => !!p);
  const lines: CartLine[] = picks.map((p, i) => ({
    key: String(i),
    productId: p.id,
    qty: i === 1 ? 1 : 2,
    extras: p.customization === 'burger' ? ['bacon', 'queijo'] : [],
    removed: [],
    choice: null,
    note: i === 0 ? 'Cortar ao meio' : '',
  }));

  return {
    number: 1048,
    createdAt: new Date(2026, 8, 23, 13, 48),
    type: 'balcao',
    payment: 'card',
    status: 1,
    customer: { mesa: '', nome: 'Ryan', deliveryNome: '', telefone: '', rua: '', numero: '', complemento: '', bairro: '' },
    lines,
    totals: computeTotals(lines, id => menu.getById(id), 'balcao'),
  };
}

@Component({
  selector: 'app-kitchen-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, KitchenTicketComponent],
  template: `
    <div class="kitchen">
      <div class="label no-print"><span class="dot pulse"></span>Cozinha · Impressora térmica 01</div>

      <div class="printer">
        <div class="printer-top no-print">
          <span class="model">TM-80</span>
          <span class="leds"><span class="on"></span><span></span></span>
        </div>
        <div class="slot no-print"></div>
        <div class="paper">
          @if (printing()) {
            <app-kitchen-ticket class="print-out" [order]="order()" />
          }
        </div>
      </div>

      <div class="actions no-print">
        <button type="button" class="btn btn-yellow btn-sm" (click)="reprint()"><app-icon name="printer" [size]="18" />Reimprimir</button>
        <button type="button" class="btn btn-ghost-light btn-sm" (click)="print()">Imprimir</button>
        @if (orders.current()) {
          <a routerLink="/pedido/acompanhar" class="btn btn-ghost-light btn-sm">Acompanhar pedido</a>
        } @else {
          <a routerLink="/" class="btn btn-ghost-light btn-sm">Ir para o início</a>
        }
      </div>
      <p class="note no-print">
        @if (!orders.current()) { Exibindo um pedido de exemplo. }
        No sistema real, a comanda sai automaticamente na impressora da cozinha ao confirmar o pedido.
      </p>
    </div>
  `,
  styles: `
    :host { display: block; }
    .kitchen { min-height: 100dvh; background: var(--red-deep); display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 24px 16px 40px; }
    .label { display: flex; align-items: center; gap: 8px; color: #FFE1DC; font-size: 13px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success-light); }
    .printer { width: 340px; max-width: 100%; display: flex; flex-direction: column; align-items: center; }
    .printer-top { width: 100%; height: 58px; border-radius: 18px 18px 8px 8px; background: #3C332C; box-shadow: inset 0 -3px 0 #1C1612, 0 8px 20px rgba(0, 0, 0, .35);
      display: flex; align-items: center; justify-content: space-between; padding: 0 18px; position: relative; z-index: 2; }
    .model { font-family: var(--font-mono); font-size: 11px; color: #A99C90; letter-spacing: .1em; }
    .leds { display: flex; gap: 6px; }
    .leds span { width: 8px; height: 8px; border-radius: 50%; background: #5A4C40; }
    .leds .on { background: var(--success-light); }
    .slot { width: 300px; height: 8px; background: #0E0B09; border-radius: 0 0 4px 4px; position: relative; z-index: 2; }
    .paper { width: 300px; overflow: hidden; margin-top: -2px; min-height: 40px; }
    .print-out { display: block; animation: printOut 2.6s steps(26, end) both; }
    @keyframes printOut { from { transform: translateY(-100%); } to { transform: translateY(0); } }
    .actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
    .actions .btn { box-shadow: none; }
    .note { font-size: 13px; color: #FFD0C8; text-align: center; max-width: 320px; }

    @media print {
      .no-print { display: none !important; }
      .kitchen { background: #fff; padding: 0; min-height: 0; display: block; }
      .printer, .paper { width: auto; overflow: visible; }
      .print-out { animation: none; }
    }
  `,
})
export class KitchenPage {
  readonly orders = inject(OrderService);
  private readonly menu = inject(MenuService);
  readonly order = computed(() => this.orders.current() ?? sampleOrder(this.menu));
  readonly printing = signal(true);

  reprint(): void {
    this.printing.set(false);
    setTimeout(() => this.printing.set(true), 60);
  }

  print(): void {
    window.print();
  }
}
