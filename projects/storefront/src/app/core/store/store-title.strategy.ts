import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { StoreContext } from './store-context.service';

/** Título da aba: "Página · Nome da loja", ou só o nome da loja na Home. */
@Injectable()
export class StoreTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly store = inject(StoreContext);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const storeName = this.store.name();
    if (!storeName) {
      // Sem loja carregada, o nome da página não faz sentido na aba.
      this.title.setTitle('Faça seu pedido');
      return;
    }

    const page = this.buildTitle(snapshot);
    this.title.setTitle(page ? `${page} · ${storeName}` : storeName);
  }
}
