import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-drinks-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent],
  template: `
    <div class="screen-in">
      <div class="container head">
        <h1 class="page-title">Bebidas</h1>
        <p class="muted">Pra acompanhar o lanche, tudo bem gelado.</p>
      </div>

      <div class="container grid">
        @for (p of menu.drinks(); track p.id) {
          <app-product-card [product]="p" variant="row" />
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; padding-bottom: 110px; }
    .head { padding-top: 22px; display: flex; flex-direction: column; gap: 4px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 12px; padding-top: 16px; }
    @media (min-width: 768px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  `,
})
export class DrinksPage {
  readonly menu = inject(MenuService);
}
