import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldErrors } from '../../core/api/api-problem';
import { fieldMessage } from '../../shared/form-errors';
import { centsToInput, parseCents } from '../../shared/money';
import { SheetComponent } from '../../shared/sheet.component';
import { Product } from './catalog.models';
import { CatalogStore } from './catalog.store';

type ProductField = 'categoryId' | 'name' | 'description' | 'price' | 'size';

@Component({
  selector: 'adm-product-form',
  imports: [ReactiveFormsModule, SheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-form.component.html',
  styleUrl: './catalog-form.scss',
})
export class ProductFormComponent implements OnInit {
  readonly product = input<Product | null>(null);
  readonly categoryId = input.required<string>();
  readonly closed = output<void>();

  protected readonly store = inject(CatalogStore);

  protected readonly form = inject(NonNullableFormBuilder).group({
    categoryId: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', Validators.maxLength(500)],
    price: ['', Validators.required],
    size: ['', Validators.maxLength(20)],
    isAvailable: [true],
    isFeatured: [false],
  });
  protected readonly saving = signal(false);
  protected readonly failure = signal<string | null>(null);
  private readonly serverErrors = signal<FieldErrors>({});

  ngOnInit(): void {
    const product = this.product();
    this.form.patchValue(
      product
        ? {
            categoryId: product.categoryId,
            name: product.name,
            description: product.description,
            price: centsToInput(product.priceInCents),
            size: product.size ?? '',
            isAvailable: product.isAvailable,
            isFeatured: product.isFeatured,
          }
        : { categoryId: this.categoryId() },
    );
  }

  protected error(field: ProductField): string | null {
    return fieldMessage(this.form.controls[field], this.serverErrors()[field]);
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched();
    this.failure.set(null);
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const priceInCents = parseCents(value.price);
    if (priceInCents === null) {
      this.serverErrors.set({ price: ['Use um valor como 24,90.'] });
      return;
    }

    this.saving.set(true);
    const result = await this.store.saveProduct(this.product()?.id ?? null, {
      categoryId: value.categoryId,
      name: value.name,
      description: value.description,
      priceInCents,
      size: value.size || null,
      imageUrl: this.product()?.imageUrl ?? null,
      isAvailable: value.isAvailable,
      isFeatured: value.isFeatured,
    });
    this.saving.set(false);

    if (result.ok) {
      this.closed.emit();
      return;
    }

    this.serverErrors.set({ ...result.fields, price: result.fields['priceInCents'] ?? [] });
    if (result.code !== 'validation_failed') {
      this.failure.set('Não foi possível salvar o produto. Tente de novo.');
    }
  }
}
