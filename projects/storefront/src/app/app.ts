import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { BottomNavComponent } from './shared/layout/bottom-nav.component';
import { CartBarComponent } from './shared/layout/cart-bar.component';
import { SiteHeaderComponent } from './shared/layout/site-header.component';
import { ToastComponent } from './shared/layout/toast.component';
import { ProductSheetComponent } from './shared/product-sheet/product-sheet.component';
import { StorefrontLoader } from './core/store/storefront-loader.service';
import { StoreUnavailableComponent } from './core/store/store-unavailable.component';

/** Rotas que usam o cabeçalho principal, a navegação inferior e a barra do carrinho. */
const TAB_ROUTES = ['/', '/cardapio', '/bebidas', '/promocoes', '/carrinho'];

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SiteHeaderComponent, BottomNavComponent, CartBarComponent, ToastComponent, ProductSheetComponent, StoreUnavailableComponent],
  template: `
    @if (loader.status() === 'ready') {
      @if (isTab()) {
        <app-site-header [onRed]="isHome()" />
      }
      <main [class.with-nav]="isTab()">
        <router-outlet />
      </main>
      @if (isTab()) {
        @if (!isCart()) { <app-cart-bar /> }
        <app-bottom-nav />
      }
      <app-toast />
      <app-product-sheet />
    } @else {
      <app-store-unavailable />
    }
  `,
  styles: `
    main.with-nav { padding-bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom)); }
    @media (min-width: 768px) { main.with-nav { padding-bottom: 0; } }
  `,
})
export class App {
  private readonly router = inject(Router);
  readonly loader = inject(StorefrontLoader);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects.split('?')[0].split('#')[0]),
    ),
    { initialValue: '/' },
  );

  readonly isTab = computed(() => TAB_ROUTES.includes(this.url()));
  readonly isHome = computed(() => this.url() === '/');
  readonly isCart = computed(() => this.url() === '/carrinho');
}
