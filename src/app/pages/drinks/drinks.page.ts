import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DrinkCategoryId } from '../../core/models/menu.model';
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

      <nav class="chips no-scrollbar" aria-label="Tipos de bebida">
        @for (c of menu.drinkCategories; track c.id) {
          <button type="button" class="chip" [class.is-active]="c.id === selected()" [attr.aria-pressed]="c.id === selected()"
                  (click)="selected.set(c.id)">{{ c.label }}</button>
        }
      </nav>

      <div class="container grid">
        @for (p of drinks(); track p.id) {
          <app-product-card [product]="p" variant="row" />
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; padding-bottom: 110px; }
    .head { padding-top: 22px; display: flex; flex-direction: column; gap: 4px; }
    .chips { position: sticky; top: 76px; z-index: 5; background: var(--cream); display: flex; gap: 8px; overflow-x: auto;
      padding: 12px var(--gutter); max-width: var(--container); margin: 0 auto; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 12px; padding-top: 4px; }
    @media (min-width: 768px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  `,
})
export class DrinksPage {
  readonly menu = inject(MenuService);
  readonly selected = signal<DrinkCategoryId | 'all'>('all');
  readonly drinks = computed(() => this.menu.drinks(this.selected()));
}
