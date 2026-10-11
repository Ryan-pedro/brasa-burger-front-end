import { PRODUCTS } from '../data/menu.data';
import { CartLine } from '../models/order.model';
import { computeTotals, formatBRL, lineKey, unitPrice } from './pricing';

const byId = (id: string) => PRODUCTS.find(p => p.id === id)!;
const line = (p: Partial<CartLine> & { productId: string }): CartLine => ({
  key: '', qty: 1, extras: [], removed: [], choice: null, note: '', ...p,
});
const wednesday = new Date(2026, 8, 23);
const tuesday = new Date(2026, 8, 22);

describe('pricing', () => {
  it('soma adicionais ao preço unitário', () => {
    expect(unitPrice(byId('b1'), { extras: ['bacon', 'queijo'], choice: null })).toBeCloseTo(32.9);
  });

  it('soma a diferença da bebida do combo', () => {
    expect(unitPrice(byId('c1'), { extras: [], choice: 'laranja' })).toBeCloseTo(36.8);
  });

  it('agrupa itens com a mesma personalização', () => {
    const a = lineKey({ productId: 'b1', qty: 1, extras: ['queijo', 'bacon'], removed: [], choice: null, note: ' ' });
    const b = lineKey({ productId: 'b1', qty: 2, extras: ['bacon', 'queijo'], removed: [], choice: null, note: '' });
    expect(a).toBe(b);
  });

  it('aplica R$ 5 OFF a partir de R$ 30 e taxa só no delivery', () => {
    const lines = [line({ productId: 'b1', qty: 2, extras: ['bacon', 'queijo'] }), line({ productId: 'p1' }), line({ productId: 'd1', qty: 2 })];
    const balcao = computeTotals(lines, byId, 'balcao', wednesday);
    expect(balcao.subtotal).toBeCloseTo(97.7);
    expect(balcao.discount).toBe(5);
    expect(balcao.total).toBeCloseTo(92.7);
    expect(computeTotals(lines, byId, 'delivery', wednesday).total).toBeCloseTo(99.6);
  });

  it('não dá desconto abaixo de R$ 30', () => {
    expect(computeTotals([line({ productId: 'd1' })], byId, 'balcao', wednesday).discount).toBe(0);
  });

  it('Terça do Hambúrguer: 50% no burger mais barato quando vale mais que R$ 5', () => {
    const lines = [line({ productId: 'b4' }), line({ productId: 'b3' })];
    const t = computeTotals(lines, byId, 'balcao', tuesday);
    expect(t.discountLabel).toBe('Terça do Hambúrguer');
    expect(t.discount).toBeCloseTo(14.95);
  });

  it('formata em reais', () => {
    expect(formatBRL(24.9)).toBe('R$ 24,90');
  });
});
