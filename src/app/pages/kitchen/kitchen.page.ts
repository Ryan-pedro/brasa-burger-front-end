import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';
import { IconComponent } from '../../shared/icon.component';
import { KitchenTicketComponent } from '../../shared/kitchen-ticket/kitchen-ticket.component';

/** Pedido de exemplo exibido quando a tela é aberta sem um pedido feito. */
const SAMPLE_ORDER: Order = {
  number: 1048,
  createdAt: new Date(2026, 8, 23, 13, 48),
  type: 'balcao',
  payment: 'card',
  status: 1,
  customer: { mesa: '', nome: 'Ryan', deliveryNome: '', telefone: '', rua: '', numero: '', complemento: '', bairro: '' },
  lines: [
    { key: 'a', productId: 'b1', qty: 2, extras: ['bacon', 'queijo'], removed: [], choice: null, note: 'Cortar ao meio' },
    { key: 'b', productId: 'p1', qty: 1, extras: [], removed: [], choice: null, note: '' },
    { key: 'c', productId: 'd1', qty: 2, extras: [], removed: [], choice: null, note: '' },
  ],
  totals: { count: 5, subtotal: 97.7, discount: 5, discountLabel: 'R$ 5 OFF no app', fee: 0, total: 92.7 },
};

/**
 * Visão da cozinha: simula a comanda saindo da impressora térmica.
 * "Imprimir" usa window.print() com CSS de impressão (80 mm).
 * Integração real: o backend envia a comanda para a impressora (ESC/POS) ao confirmar o pedido.
 */
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
  readonly order = computed(() => this.orders.current() ?? SAMPLE_ORDER);
  readonly printing = signal(true);

  reprint(): void {
    this.printing.set(false);
    setTimeout(() => this.printing.set(true), 60);
  }

  print(): void {
    window.print();
  }
}
