import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { IconComponent } from '../../shared/icon.component';
import { FlowHeaderComponent } from '../../shared/layout/flow-header.component';

@Component({
  selector: 'app-order-confirmed-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, FlowHeaderComponent],
  template: `
    <app-flow-header title="Pedido confirmado" backTo="/" [step]="3" />

    @if (orders.current(); as o) {
      <div class="container-narrow page screen-in">
        <section class="hero">
          <span class="check check-pop"><app-icon name="check" [size]="44" [stroke]="3" /></span>
          <h2>Pedido confirmado!</h2>
          <span class="number">Pedido nº #{{ o.number }}</span>
          <p>Seu pedido foi enviado para a cozinha.</p>
        </section>

        <section class="card status">
          <h3>Status</h3>
          @for (s of steps; track s.label) {
            <div class="step">
              @if (s.done) {
                <span class="dot done"><app-icon name="check" [size]="16" [stroke]="3" /></span>
              } @else {
                <span class="dot"></span>
              }
              <span [class.todo]="!s.done">{{ s.label }}</span>
            </div>
          }
          <div class="eta"><app-icon name="clock" /><span>Tempo estimado: <strong>{{ eta() }}</strong></span></div>
        </section>

        <div class="two">
          <a routerLink="/pedido/acompanhar" class="btn btn-primary">Acompanhar pedido</a>
          <a routerLink="/cozinha/comanda" class="btn btn-dark"><app-icon name="printer" [size]="20" />Ver comanda</a>
        </div>
        <a routerLink="/" class="btn btn-outline btn-block">Voltar para o início</a>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .page { padding-top: 24px; padding-bottom: 40px; display: flex; flex-direction: column; gap: 16px; }
    .hero { background: var(--red); color: var(--white); border-radius: var(--radius-lg); padding: 30px 24px; text-align: center;
      display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .check { width: 84px; height: 84px; border-radius: 50%; background: var(--success); display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 0 10px rgba(255, 255, 255, .18); }
    .hero h2 { margin-top: 8px; font-family: var(--font-display); font-weight: 400; font-size: 34px; text-transform: uppercase; }
    .number { color: var(--yellow); font-weight: 900; font-size: 17px; }
    .hero p { color: #FFE1DC; }
    .status { padding: 20px; display: flex; flex-direction: column; gap: 14px; border-radius: 24px; }
    .status h3 { font-size: 17px; font-weight: 900; }
    .step { display: flex; align-items: center; gap: 12px; font-size: 16px; font-weight: 600; }
    .todo { color: #8A7D72; }
    .dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #D9CEC0; display: flex; align-items: center; justify-content: center; }
    .dot.done { background: var(--success); border-color: var(--success); color: var(--white); }
    .eta { display: flex; align-items: center; gap: 10px; background: var(--selected-bg); color: var(--ink); border-radius: 16px; padding: 14px 16px; margin-top: 4px; }
    .eta app-icon { color: var(--red); }
    .two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .two .btn { padding: 0 12px; font-size: 15px; }
  `,
})
export class OrderConfirmedPage {
  readonly orders = inject(OrderService);

  readonly steps = [
    { label: 'Pedido recebido', done: true },
    { label: 'Enviado para preparação', done: true },
    { label: 'Em preparo', done: false },
    { label: 'Pronto', done: false },
  ];

  readonly eta = computed(() => (this.orders.current()?.type === 'delivery' ? '35–50 minutos' : '20–30 minutos'));
}
