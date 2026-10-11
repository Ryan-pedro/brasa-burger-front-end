import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon.component';

/** Cabeçalho das etapas do checkout: voltar + título + indicador de etapas. */
@Component({
  selector: 'app-flow-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <header class="flow-header">
      <div class="container-narrow inner">
        <div class="row">
          <a [routerLink]="backTo()" class="back" aria-label="Voltar"><app-icon name="back" [stroke]="2.2" /></a>
          <h1 class="title">{{ title() }}</h1>
        </div>
        @if (step() > 0) {
          <ol class="steps" aria-label="Etapas do pedido">
            @for (s of steps; track s; let i = $index) {
              <li [class.done]="i + 1 <= step()" [class.current]="i + 1 === step()">
                <span class="num">{{ i + 1 }}</span>
                <span class="label">{{ s }}</span>
                @if (i < steps.length - 1) { <span class="bar" [class.filled]="i + 1 < step()"></span> }
              </li>
            }
          </ol>
        }
      </div>
    </header>
  `,
  styles: `
    .flow-header { position: sticky; top: 0; z-index: 40; background: var(--cream); border-bottom: 1px solid var(--line); }
    .inner { padding-top: 10px; padding-bottom: 14px; display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; align-items: center; gap: 12px; }
    .back { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--line-2); background: var(--white);
      display: flex; align-items: center; justify-content: center; color: var(--ink); }
    .title { font-family: var(--font-display); font-weight: 400; font-size: 24px; text-transform: uppercase; color: var(--red); }
    .steps { list-style: none; margin: 0; padding: 0; display: flex; gap: 8px; }
    li { display: flex; align-items: center; gap: 8px; flex-grow: 1; }
    .num { width: 26px; height: 26px; border-radius: 50%; background: var(--sand-2); color: var(--muted); font-size: 13px; font-weight: 900;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .label { font-size: 13px; font-weight: 900; color: #8A7D72; }
    li.done .num { background: var(--red); color: var(--white); }
    li.current .label { color: var(--ink); }
    .bar { flex-grow: 1; height: 3px; border-radius: 2px; background: #EFDCC6; min-width: 12px; }
    .bar.filled { background: var(--red); }
  `,
})
export class FlowHeaderComponent {
  readonly title = input.required<string>();
  readonly backTo = input('/');
  /** 1 = Tipo, 2 = Revisão, 3 = Confirmação; 0 oculta o indicador. */
  readonly step = input(0);
  readonly steps = ['Tipo', 'Revisão', 'Confirmação'];
}
