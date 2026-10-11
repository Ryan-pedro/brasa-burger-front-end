import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../core/services/menu.service';
import { ProductSheetService } from '../../core/services/product-sheet.service';

@Component({
  selector: 'app-promos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="container screen-in page">
      <div class="head">
        <h1 class="page-title">Promoções</h1>
        <p class="muted">Ofertas válidas para pedidos feitos por aqui.</p>
      </div>

      <div class="grid">
        <article class="promo red">
          <span class="kicker">Combo da Semana</span>
          <h2>X-Bacon + Batata + Refrigerante</h2>
          <span class="prices"><s>De R$ 39,90</s><strong>R$ 32,90</strong></span>
          <button type="button" class="btn promo-btn white-btn" (click)="openCombo()">Quero esse combo</button>
          <img src="img/produtos/combo_semana.svg" alt="">
        </article>

        <article class="promo dark">
          <span class="kicker">Terça do Hambúrguer</span>
          <h2>Levou 2 hambúrgueres? O 2º sai pela metade.</h2>
          <p>Desconto de 50% no hambúrguer de menor valor. Válido às terças.</p>
          <a routerLink="/cardapio" [queryParams]="{ categoria: 'burgers' }" class="btn btn-yellow promo-btn">Ver hambúrgueres</a>
          <img src="img/produtos/b_smash.svg" alt="">
        </article>

        <article class="promo yellow">
          <span class="kicker">Pedido pelo app</span>
          <h2>R$ 5 OFF em pedidos acima de R$ 30</h2>
          <p>Sem cupom: o desconto aparece sozinho no resumo do carrinho.</p>
          <a routerLink="/cardapio" class="btn btn-primary promo-btn">Fazer pedido</a>
          <img src="img/produtos/fritas.svg" alt="">
        </article>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; padding-bottom: 110px; }
    .page { padding-top: 22px; display: flex; flex-direction: column; gap: 16px; }
    .head { display: flex; flex-direction: column; gap: 4px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    @media (min-width: 768px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    .promo { position: relative; overflow: hidden; min-height: 260px; border-radius: var(--radius-lg); padding: 24px;
      display: flex; flex-direction: column; gap: 12px; }
    .promo h2 { font-family: var(--font-display); font-weight: 400; font-size: 28px; line-height: 1.02; text-transform: uppercase; max-width: 62%; }
    .promo p { font-size: 14px; max-width: 62%; }
    .promo img { position: absolute; right: -40px; bottom: 24px; width: 220px; }
    .kicker { font-family: var(--font-display); font-size: 13px; letter-spacing: .1em; text-transform: uppercase; }
    .prices { display: flex; flex-direction: column; }
    .prices s { font-size: 15px; color: #FFD9C9; }
    .prices strong { font-family: var(--font-display); font-weight: 400; font-size: 40px; line-height: 1; }
    .promo-btn { align-self: flex-start; margin-top: auto; position: relative; z-index: 1; box-shadow: none; }
    .red { background: var(--red); color: var(--white); }
    .red .kicker { color: #FFD98A; }
    .white-btn { background: var(--white); color: var(--red); }
    .dark { background: var(--ink); color: var(--white); }
    .dark .kicker { color: var(--yellow); }
    .dark p { color: #D6CABD; }
    .yellow { background: var(--yellow); color: var(--ink); }
    .yellow .kicker { color: #7A3A10; }
  `,
})
export class PromosPage {
  private readonly menu = inject(MenuService);
  private readonly sheet = inject(ProductSheetService);

  openCombo(): void {
    this.sheet.open(this.menu.getById('c1'));
  }
}
