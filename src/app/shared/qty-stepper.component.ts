import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from './icon.component';

/** Controle de quantidade: [-] 2 [+]. */
@Component({
  selector: 'app-qty-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="stepper" [class.large]="large()">
      <button type="button" class="minus" (click)="decrease.emit()" aria-label="Diminuir quantidade">
        <app-icon name="minus" [size]="18" [stroke]="2.6" />
      </button>
      <span class="value" aria-live="polite">{{ value() }}</span>
      <button type="button" class="plus" (click)="increase.emit()" aria-label="Aumentar quantidade">
        <app-icon name="plus" [size]="18" [stroke]="2.6" />
      </button>
    </div>
  `,
  styles: `
    .stepper { display: inline-flex; align-items: center; gap: 2px; background: var(--sand); border-radius: 999px; padding: 3px; }
    button { width: 38px; height: 38px; border: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform .12s; }
    button:active { transform: scale(.9); }
    .minus { background: var(--white); color: var(--ink); }
    .plus { background: var(--red); color: var(--white); }
    .value { min-width: 30px; text-align: center; font-weight: 900; font-size: 16px; }
    .large button { width: 44px; height: 44px; }
    .large .value { font-size: 18px; }
  `,
})
export class QtyStepperComponent {
  readonly value = input.required<number>();
  readonly large = input(false);
  readonly increase = output<void>();
  readonly decrease = output<void>();
}
