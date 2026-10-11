import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { COMBO_DRINKS } from '../../core/data/menu.data';
import { CartService } from '../../core/services/cart.service';
import { MenuService } from '../../core/services/menu.service';
import { ProductSheetService } from '../../core/services/product-sheet.service';
import { extrasFor, unitPrice } from '../../core/utils/pricing';
import { BrlPipe } from '../brl.pipe';
import { IconComponent } from '../icon.component';
import { QtyStepperComponent } from '../qty-stepper.component';

interface Draft {
  qty: number;
  extras: string[];
  removed: string[];
  choice: string | null;
  note: string;
}

/**
 * Modal de detalhes + personalização do produto.
 * Bottom sheet no celular e janela centralizada a partir do tablet.
 */
@Component({
  selector: 'app-product-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrlPipe, IconComponent, QtyStepperComponent],
  templateUrl: './product-sheet.component.html',
  styleUrl: './product-sheet.component.scss',
  host: { '(document:keydown.escape)': 'close()' },
})
export class ProductSheetComponent {
  private readonly sheet = inject(ProductSheetService);
  private readonly cart = inject(CartService);
  private readonly menu = inject(MenuService);

  readonly state = this.sheet.state;
  readonly product = computed(() => this.state()?.product ?? null);
  readonly isEditing = computed(() => !!this.state()?.editing);
  readonly tint = computed(() => (this.product() ? this.menu.tint(this.product()!) : ''));
  readonly comboDrinks = COMBO_DRINKS;

  /** Rascunho reiniciado sempre que outro produto é aberto. */
  readonly draft = linkedSignal<Draft>(() => {
    const s = this.state();
    if (s?.editing) {
      const e = s.editing;
      return { qty: e.qty, extras: [...e.extras], removed: [...e.removed], choice: e.choice, note: e.note };
    }
    return { qty: 1, extras: [], removed: [], choice: s?.product.customization === 'combo' ? 'coca' : null, note: '' };
  });

  readonly extras = computed(() => (this.product() ? extrasFor(this.product()!) : []));
  readonly unit = computed(() => (this.product() ? unitPrice(this.product()!, this.draft()) : 0));
  readonly total = computed(() => this.unit() * this.draft().qty);
  readonly removedSummary = computed(() => {
    const p = this.product();
    const removed = this.draft().removed;
    return (p?.ingredients ?? []).filter(g => removed.includes(g.id)).map(g => 'sem ' + g.label.toLowerCase()).join(', ');
  });

  private patch(p: Partial<Draft>): void {
    this.draft.update(d => ({ ...d, ...p }));
  }

  private toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter(x => x !== id) : [...list, id];
  }

  toggleIngredient(id: string): void { this.patch({ removed: this.toggle(this.draft().removed, id) }); }
  toggleExtra(id: string): void { this.patch({ extras: this.toggle(this.draft().extras, id) }); }
  pickChoice(id: string): void { this.patch({ choice: id }); }
  setNote(e: Event): void { this.patch({ note: (e.target as HTMLTextAreaElement).value }); }
  inc(): void { this.patch({ qty: this.draft().qty + 1 }); }
  dec(): void { this.patch({ qty: Math.max(1, this.draft().qty - 1) }); }

  isRemoved(id: string): boolean { return this.draft().removed.includes(id); }
  hasExtra(id: string): boolean { return this.draft().extras.includes(id); }

  confirm(): void {
    const p = this.product();
    if (!p) return;
    const d = this.draft();
    this.cart.add({ productId: p.id, ...d }, this.state()?.editing?.key);
    this.close();
  }

  close(): void {
    this.sheet.close();
  }
}
