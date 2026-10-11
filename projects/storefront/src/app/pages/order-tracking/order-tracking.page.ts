import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ORDER_TYPE_LABELS, OrderService, customerSummary } from '../../core/services/order.service';
import { IconComponent } from '../../shared/icon.component';
import { FlowHeaderComponent } from '../../shared/layout/flow-header.component';

@Component({
  selector: 'app-order-tracking-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, IconComponent, FlowHeaderComponent],
  template: `
    <app-flow-header title="Acompanhar pedido" backTo="/pedido/confirmado" />

    @if (orders.current(); as o) {
      <div class="container-narrow page screen-in">
        <section class="summary">
          <div class="row"><span class="num">Pedido #{{ o.number }}</span><span>{{ o.createdAt | date: 'HH:mm' }}</span></div>
          <span class="who">{{ typeLabel() }} · {{ who() }}</span>
          <div class="progress" role="progressbar" [attr.aria-valuenow]="o.status" aria-valuemin="0" [attr.aria-valuemax]="orders.statuses.length - 1">
            <div class="fill" [style.width.%]="progress()"></div>
          </div>
        </section>

        <ol class="card timeline">
          @for (s of orders.statuses; track s.label; let i = $index; let last = $last) {
            <li [class.done]="i <= o.status" [class.current]="i === o.status">
              <div class="rail">
                <span class="dot" [class.pulse]="i === o.status">
                  @if (i <= o.status) { <app-icon name="check" [size]="14" [stroke]="3.4" /> }
                </span>
                @if (!last) { <span class="line" [class.filled]="i < o.status"></span> }
              </div>
              <div class="text"><strong>{{ s.label }}</strong><small>{{ s.hint }}</small></div>
            </li>
          }
        </ol>

        @if (!orders.isFinished()) {
          <button type="button" class="btn btn-dark btn-block" (click)="orders.advanceStatus()">Simular próxima etapa</button>
        } @else {
          <button type="button" class="btn btn-outline btn-block" (click)="orders.resetStatus()">Reiniciar simulação</button>
        }
        <a routerLink="/" class="btn btn-primary btn-block">Fazer novo pedido</a>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .page { padding-top: 20px; padding-bottom: 40px; display: flex; flex-direction: column; gap: 16px; }
    .summary { background: var(--red); color: var(--white); border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; justify-content: space-between; align-items: baseline; color: #FFE1DC; }
    .num { font-family: var(--font-display); font-size: 26px; color: var(--white); text-transform: uppercase; }
    .who { font-size: 14px; color: #FFE1DC; }
    .progress { height: 10px; border-radius: 5px; background: var(--red-deep); overflow: hidden; }
    .fill { height: 100%; background: var(--yellow); border-radius: 5px; transition: width .6s cubic-bezier(.2, .9, .3, 1); }
    .timeline { list-style: none; margin: 0; padding: 22px 20px 6px; border-radius: 24px; }
    li { display: flex; gap: 14px; }
    .rail { display: flex; flex-direction: column; align-items: center; width: 28px; }
    .dot { width: 28px; height: 28px; border-radius: 50%; background: var(--white); border: 2px solid #D9CEC0; color: var(--white);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    li.done .dot { background: var(--success); border-color: var(--success); }
    .line { width: 3px; flex-grow: 1; min-height: 30px; background: #E6DCCF; border-radius: 2px; margin: 4px 0; }
    .line.filled { background: var(--success); }
    .text { display: flex; flex-direction: column; gap: 2px; padding-bottom: 18px; }
    .text strong { font-size: 16px; font-weight: 600; color: #8A7D72; }
    li.done .text strong { color: var(--ink); }
    li.current .text strong { font-weight: 900; }
    .text small { font-size: 13px; color: var(--muted); }
  `,
})
export class OrderTrackingPage {
  readonly orders = inject(OrderService);
  readonly typeLabel = computed(() => ORDER_TYPE_LABELS[this.orders.current()!.type]);
  readonly who = computed(() => customerSummary(this.orders.current()!.type, this.orders.current()!.customer).who);
  readonly progress = computed(() => ((this.orders.current()?.status ?? 0) / (this.orders.statuses.length - 1)) * 100);
}
