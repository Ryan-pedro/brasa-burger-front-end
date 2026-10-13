import { centsToInput, formatCents, parseCents } from './money';

describe('money', () => {
  it.each([
    ['24,90', 2490],
    ['24.90', 2490],
    ['24', 2400],
    ['1.234,50', 123450],
    ['R$ 6,5', 650],
  ])('lê "%s" como %i centavos', (text, cents) => expect(parseCents(text)).toBe(cents));

  it.each(['', 'abc', '12,345', '-3'])('recusa "%s"', (text) => expect(parseCents(text)).toBeNull());

  it('formata para exibição e para edição', () => {
    expect(formatCents(2490).replace(/\s/g, ' ')).toBe('R$ 24,90');
    expect(centsToInput(600)).toBe('6,00');
  });
});
