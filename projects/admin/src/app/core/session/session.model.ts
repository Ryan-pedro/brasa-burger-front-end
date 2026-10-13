export type StaffRole = 'Owner' | 'Manager' | 'Kitchen';

export interface AdminSessionData {
  user: { id: string; email: string; name: string };
  role: StaffRole;
  permissions: string[];
}

export const ROLE_LABELS: Record<StaffRole, string> = {
  Owner: 'Dono',
  Manager: 'Gerente',
  Kitchen: 'Cozinha',
};
