import { safeReturnUrl } from './return-url';

describe('safeReturnUrl', () => {
  it('aceita caminhos do próprio painel', () => {
    expect(safeReturnUrl('/pedidos?status=novo')).toBe('/pedidos?status=novo');
  });

  it.each([undefined, null, '', 'pedidos', '//outro-site.com', '/\\outro-site.com', 'https://outro-site.com'])(
    'troca %s por "/"',
    (value) => expect(safeReturnUrl(value)).toBe('/'),
  );
});
