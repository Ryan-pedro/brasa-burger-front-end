import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryId } from '../../core/models/menu.model';
import { MenuService } from '../../core/services/menu.service';
import { IconComponent } from '../../shared/icon.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, ProductCardComponent],
  template: `
    <div class="screen-in">
      <div class="container head">
        <h1 class="page-title">Cardápio</h1>
        <label class="search">
          <app-icon name="search" [size]="20" />
          <span class="sr-only">Buscar na categoria</span>
          <input type="search" placeholder="Buscar na categoria…" [value]="search()" (input)="onSearch($event)">
        </label>
      </div>

      <nav class="chips no-scrollbar" aria-label="Categorias">
        @for (c of menu.categories(); track c.id) {
          <button type="button" class="chip cat-chip" [class.is-active]="c.id === selected()" (click)="select(c.id)"
                  [attr.aria-pressed]="c.id === selected()">
            <span class="chip-img"><img [src]="c.image" alt=""></span>{{ c.label }}
          </button>
        }
      </nav>

      <div class="container">
        <div class="list-head">
          <h2 class="cat-title">{{ categoryLabel() }}</h2>
          <span class="muted">{{ products().length }} opções</span>
        </div>

        @if (products().length === 0) {
          <p class="empty card">Nenhum item encontrado nessa categoria.</p>
        }

        <div class="grid">
          @for (p of products(); track p.id) {
            <app-product-card [product]="p" />
          }
        </div>

        <div class="drinks-cta">
          <span><strong>Vai uma bebida gelada?</strong><small>Refris, sucos naturais e milk-shakes</small></span>
          <a routerLink="/bebidas" class="btn btn-yellow btn-sm">Ver bebidas</a>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; padding-bottom: 110px; }
    .head { padding-top: 22px; display: flex; flex-direction: column; gap: 14px; }
    .search { display: flex; align-items: center; gap: 10px; height: 52px; border-radius: 999px; background: var(--white);
      border: 1.5px solid var(--line-2); padding: 0 18px; color: var(--muted); max-width: 520px; }
    .search:focus-within { border-color: var(--red); }
    .search input { border: 0; outline: none; background: transparent; font-size: 16px; flex-grow: 1; height: 100%; color: var(--ink); }
    .chips { position: sticky; top: 76px; z-index: 5; background: var(--cream); display: flex; gap: 8px; overflow-x: auto;
      padding: 12px var(--gutter); max-width: var(--container); margin: 0 auto; }
    .cat-chip { height: 48px; padding: 0 16px 0 6px; }
    .chip-img { width: 36px; height: 36px; border-radius: 50%; background: var(--sand); display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .chip-img img { width: 38px; max-width: none; }
    .list-head { padding: 10px 0 14px; display: flex; align-items: baseline; justify-content: space-between; }
    .cat-title { font-family: var(--font-display); font-weight: 400; font-size: 24px; text-transform: uppercase; }
    .empty { padding: 24px; text-align: center; color: var(--muted); margin-bottom: 14px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    @media (min-width: 768px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (min-width: 1024px) { .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
    .drinks-cta { margin-top: 24px; background: var(--red); color: var(--white); border-radius: 24px; padding: 18px 20px;
      display: flex; align-items: center; justify-content: space-between; gap: 14px; }
    .drinks-cta span { display: flex; flex-direction: column; gap: 2px; }
    .drinks-cta small { font-size: 13px; color: #FFE1DC; }
    .drinks-cta .btn { box-shadow: none; flex-shrink: 0; }
  `,
})
export class MenuPage {
  readonly menu = inject(MenuService);
  private readonly router = inject(Router);

  /** Lido de ?categoria=… (withComponentInputBinding). */
  readonly categoria = input<CategoryId | undefined>();
  readonly selected = linkedSignal<CategoryId>(() => {
    const c = this.categoria();
    const categories = this.menu.categories();
    return c && categories.some(x => x.id === c) ? c : (categories[0]?.id ?? '');
  });
  readonly search = signal('');

  readonly products = computed(() => this.menu.byCategory(this.selected(), this.search()));
  readonly categoryLabel = computed(() => this.menu.categories().find(c => c.id === this.selected())?.label ?? '');

  select(id: CategoryId): void {
    this.selected.set(id);
    this.search.set('');
    this.router.navigate([], { queryParams: { categoria: id }, replaceUrl: true });
  }

  onSearch(e: Event): void {
    this.search.set((e.target as HTMLInputElement).value);
  }
}
