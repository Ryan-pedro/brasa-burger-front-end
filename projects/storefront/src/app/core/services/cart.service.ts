import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartLine, CartLineInput } from '../models/order.model';
import { lineKey } from '../utils/pricing';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'brasa.cart';

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

/**
 * Estado do carrinho (signals), salvo no localStorage para sobreviver a um recarregamento.
 * Pode ser trocado por sincronização com a API (carrinho por sessão/cliente).
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly toast = inject(ToastService);

  readonly lines = signal<CartLine[]>(loadCart());
  readonly count = computed(() => this.lines().reduce((s, l) => s + l.qty, 0));
  readonly isEmpty = computed(() => this.lines().length === 0);

  /** Quantidade de um produto no carrinho (somando personalizações). */
  readonly qtyByProduct = computed(() => {
    const map = new Map<string, number>();
    for (const l of this.lines()) map.set(l.productId, (map.get(l.productId) ?? 0) + l.qty);
    return map;
  });

  constructor() {
    effect(() => {
      const lines = this.lines();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      } catch {
        /* armazenamento indisponível (modo privado etc.) */
      }
    });
  }

  /** Adiciona uma linha. Se `replaceKey` for informado, substitui a linha editada. */
  add(input: CartLineInput, replaceKey?: string): void {
    const key = lineKey(input);
    this.lines.update(lines => {
      const base = replaceKey ? lines.filter(l => l.key !== replaceKey) : [...lines];
      const existing = base.find(l => l.key === key);
      return existing
        ? base.map(l => (l.key === key ? { ...l, qty: l.qty + input.qty } : l))
        : [...base, { ...input, key }];
    });
    this.toast.show(replaceKey ? 'Item atualizado no pedido' : 'Produto adicionado ao pedido');
  }

  increment(key: string): void {
    this.lines.update(lines => lines.map(l => (l.key === key ? { ...l, qty: l.qty + 1 } : l)));
  }

  decrement(key: string): void {
    this.lines.update(lines =>
      lines.map(l => (l.key === key ? { ...l, qty: l.qty - 1 } : l)).filter(l => l.qty > 0),
    );
  }

  remove(key: string): void {
    this.lines.update(lines => lines.filter(l => l.key !== key));
    this.toast.show('Item removido');
  }

  clear(): void {
    this.lines.set([]);
  }
}
