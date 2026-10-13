import { AbstractControl } from '@angular/forms';

export function fieldMessage(control: AbstractControl, serverMessages?: readonly string[]): string | null {
  const errors = control.touched ? control.errors : null;
  if (errors?.['required']) {
    return 'Preencha este campo.';
  }
  if (errors?.['maxlength']) {
    return `Use no máximo ${errors['maxlength'].requiredLength} caracteres.`;
  }
  return serverMessages?.[0] ?? null;
}
