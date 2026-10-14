/**
 * Regras de preço puras (sem estado) — fáceis de testar e de mover para o backend.
 */
import { COMBO_DRINKS, EXTRAS, MENU_SLUGS, RESTAURANT } from '../data/menu.data';
import { Product } from '../models/menu.model';
import { CartLine, CartLineInput, CartTotals, OrderType } from '../models/order.model';

export type LineDetailKind = 'choice' | 'extra' | 'removed';

export interface LineDetail {
  kind: LineDetailKind;
  /** Texto para a interface do cliente. */
  text: string;
  /** Texto em caixa alta para a comanda da cozinha. */
  ticket: string;
}

export function extrasFor(product: Product) {
  return product.customization && product.customization !== 'combo' ? EXTRAS[product.customization] : [];
}

/** Preço unitário = base + adicionais + diferença da opção escolhida. */
export function unitPrice(product: Product, line: Pick<CartLine, 'extras' | 'choice'>): number {
  let value = product.price;
  for (const extra of extrasFor(product)) {
    if (line.extras.includes(extra.id)) value += extra.price;
  }
  if (line.choice) {
    value += COMBO_DRINKS.find(c => c.id === line.choice)?.price ?? 0;
  }
  return value;
}

/** Chave estável: itens com a mesma personalização são agrupados. */
export function lineKey(line: CartLineInput): string {
  return [
    line.productId,
    [...line.extras].sort().join(','),
    [...line.removed].sort().join(','),
    line.choice ?? '',
    line.note.trim(),
  ].join('|');
}

/** Descrição das escolhas da linha (bebida, adicionais, remoções). */
export function lineDetails(product: Product, line: CartLine): LineDetail[] {
  const out: LineDetail[] = [];
  if (line.choice) {
    const c = COMBO_DRINKS.find(x => x.id === line.choice);
    if (c) out.push({ kind: 'choice', text: `Bebida: ${c.label}`, ticket: `BEBIDA: ${c.label.toUpperCase()}` });
  }
  for (const e of extrasFor(product)) {
    if (line.extras.includes(e.id)) {
      out.push({ kind: 'extra', text: `+ ${e.label} (${formatBRL(e.price)})`, ticket: `+ ${e.label.toUpperCase()}` });
    }
  }
  for (const g of product.ingredients ?? []) {
    if (line.removed.includes(g.id)) {
      out.push({ kind: 'removed', text: `Sem ${g.label.toLowerCase()}`, ticket: `SEM ${g.label.toUpperCase()}` });
    }
  }
  return out;
}

/**
 * Totais do pedido com as promoções:
 *  - R$ 5 OFF em pedidos a partir de R$ 30 (pedido pelo app);
 *  - Terça do Hambúrguer: 50% no hambúrguer de menor valor ao levar 2+ (só às terças).
 * Vale o maior desconto. Taxa de entrega só no delivery.
 */
export function computeTotals(
  lines: CartLine[],
  getProduct: (id: string) => Product,
  type: OrderType,
  today: Date = new Date(),
): CartTotals {
  const subtotal = lines.reduce((s, l) => s + unitPrice(getProduct(l.productId), l) * l.qty, 0);
  let discount = 0;
  let discountLabel = '';

  if (subtotal >= 30) {
    discount = 5;
    discountLabel = 'R$ 5 OFF no app';
  }

  if (today.getDay() === 2) {
    const burgerPrices: number[] = [];
    for (const l of lines) {
      const p = getProduct(l.productId);
      if (p.category === MENU_SLUGS.burgers) for (let i = 0; i < l.qty; i++) burgerPrices.push(p.price);
    }
    if (burgerPrices.length >= 2) {
      const tuesday = Math.min(...burgerPrices) * 0.5;
      if (tuesday > discount) {
        discount = tuesday;
        discountLabel = 'Terça do Hambúrguer';
      }
    }
  }

  const fee = type === 'delivery' ? RESTAURANT.deliveryFee : 0;
  return {
    count: lines.reduce((s, l) => s + l.qty, 0),
    subtotal,
    discount,
    discountLabel,
    fee,
    total: Math.max(0, subtotal - discount + fee),
  };
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatBRL(value: number): string {
  return brl.format(value).replace(/ /g, ' ');
}
