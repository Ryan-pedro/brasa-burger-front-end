/** Papéis da equipe, como a API os devolve. */
export type StaffRole = 'Owner' | 'Manager' | 'Kitchen';

/** Resposta de GET /api/v1/admin/session e de POST /api/v1/admin/auth/login. */
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
