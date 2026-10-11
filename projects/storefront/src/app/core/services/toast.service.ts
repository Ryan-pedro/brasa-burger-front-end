import { Injectable, signal } from '@angular/core';

/** Mensagem curta de feedback ("Produto adicionado ao pedido"). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);
  /** Muda a cada exibição para reiniciar a animação. */
  readonly id = signal(0);
  private timer?: ReturnType<typeof setTimeout>;

  show(message: string, durationMs = 2200): void {
    clearTimeout(this.timer);
    this.message.set(message);
    this.id.update(n => n + 1);
    this.timer = setTimeout(() => this.message.set(null), durationMs);
  }
}
