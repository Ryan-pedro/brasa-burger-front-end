/** "Bom dia" até 11h59, "Boa tarde" até 17h59, "Boa noite" no resto. */
export function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function firstName(fullName: string | null | undefined): string {
  return fullName?.trim().split(/\s+/)[0] ?? '';
}
