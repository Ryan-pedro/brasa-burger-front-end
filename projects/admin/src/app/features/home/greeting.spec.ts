import { firstName, greetingFor } from './greeting';

describe('saudação', () => {
  it.each([
    [5, 'Bom dia'],
    [11, 'Bom dia'],
    [12, 'Boa tarde'],
    [17, 'Boa tarde'],
    [18, 'Boa noite'],
    [2, 'Boa noite'],
  ])('às %ih diz "%s"', (hour, expected) => expect(greetingFor(hour)).toBe(expected));

  it('usa só o primeiro nome', () => {
    expect(firstName('  Ana Maria Souza ')).toBe('Ana');
    expect(firstName(undefined)).toBe('');
  });
});
