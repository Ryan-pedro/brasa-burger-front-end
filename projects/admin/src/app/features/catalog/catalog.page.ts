import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Permission } from '../../core/session/permissions';
import { BrlPipe } from '../../shared/brl.pipe';
import { CanDirective } from '../../shared/can.directive';
import { CategoryFormComponent } from './category-form.component';
import { Category, Product } from './catalog.models';
import { CatalogStore } from './catalog.store';
import { ProductFormComponent } from './product-form.component';

type Editing =
  | { kind: 'category'; category: Category | null }
  | { kind: 'product'; product: Product | null; categoryId: string };

@Component({
  selector: 'adm-catalog-page',
  imports: [BrlPipe, CanDirective, CategoryFormComponent, ProductFormComponent],
  providers: [CatalogStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.page.html',
  styleUrl: './catalog.page.scss',
})
export class CatalogPage implements OnInit {
  protected readonly store = inject(CatalogStore);
  protected readonly write = Permission.CatalogWrite;
  protected readonly editing = signal<Editing | null>(null);

  ngOnInit(): void {
    void this.store.load();
  }

  protected editCategory(category: Category | null): void {
    this.editing.set({ kind: 'category', category });
  }

  protected editProduct(product: Product | null, categoryId: string): void {
    this.editing.set({ kind: 'product', product, categoryId });
  }
}
