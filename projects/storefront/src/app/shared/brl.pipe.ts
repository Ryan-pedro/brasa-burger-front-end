import { Pipe, PipeTransform } from '@angular/core';
import { formatBRL } from '../core/utils/pricing';

/** Formata número como moeda brasileira: 24.9 → "R$ 24,90". */
@Pipe({ name: 'brl' })
export class BrlPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatBRL(value ?? 0);
  }
}
