/**
 * Endereço para onde voltar depois do login. Só aceita caminhos internos do painel:
 * "//outro-site.com" ou "https://..." viram "/", para o login não servir de redirecionador.
 */
export function safeReturnUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return '/';
  }

  return value;
}
