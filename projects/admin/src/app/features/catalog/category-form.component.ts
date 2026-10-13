import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldErrors } from '../../core/api/api-problem';
import { fieldMessage } from '../../shared/form-errors';
import { SheetComponent } from '../../shared/sheet.component';
import { Category } from './catalog.models';
import { CatalogStore } from './catalog.store';

const CONFLICT_MESSAGE = 'Já existe uma categoria com esse nome.';

@Component({
  selector: 'adm-category-form',
  imports: [ReactiveFormsModule, SheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <adm-sheet [heading]="category() ? 'Editar categoria' : 'Nova categoria'" (closed)="closed.emit()">
      <form class="form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="field">
          <label for="category-name">Nome</label>
          <input id="category-name" class="input" formControlName="name" [attr.aria-invalid]="!!error('name')" />
          @if (error('name'); as message) {
            <p class="field-error">{{ message }}</p>
          }
        </div>

        <label class="check">
          <input type="checkbox" formControlName="isActive" />
          Aparece no cardápio da loja
        </label>

        <button type="submit" class="btn btn-primary" [disabled]="saving()">
          {{ saving() ? 'Salvando…' : 'Salvar categoria' }}
        </button>
      </form>
    </adm-sheet>
  `,
  styleUrl: './catalog-form.scss',
})
export class CategoryFormComponent implements OnInit {
  readonly category = input<Category | null>(null);
  readonly closed = output<void>();

  private readonly store = inject(CatalogStore);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    isActive: [true],
  });
  protected readonly saving = signal(false);
  private readonly serverErrors = signal<FieldErrors>({});

  ngOnInit(): void {
    const category = this.category();
    if (category) {
      this.form.setValue({ name: category.name, isActive: category.isActive });
    }
  }

  protected error(field: 'name'): string | null {
    return fieldMessage(this.form.controls[field], this.serverErrors()[field]);
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.saving.set(true);
    const result = await this.store.saveCategory(this.category()?.id ?? null, this.form.getRawValue());
    this.saving.set(false);

    if (result.ok) {
      this.closed.emit();
      return;
    }

    this.serverErrors.set(result.code === 'category_name_taken' ? { name: [CONFLICT_MESSAGE] } : result.fields);
  }
}
