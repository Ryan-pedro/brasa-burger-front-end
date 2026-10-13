import { Pipe, PipeTransform } from '@angular/core';
import { formatCents } from './money';

@Pipe({ name: 'brl' })
export class BrlPipe implements PipeTransform {
  transform(cents: number): string {
    return formatCents(cents);
  }
}
