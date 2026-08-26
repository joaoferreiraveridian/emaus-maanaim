export type UserRole = 'pastor' | 'lider' | 'ministrador'

export const ROLES_GESTAO: UserRole[] = ['pastor', 'lider']

export const NAV_ITEMS = [
  { label: 'Relatórios', icon: 'ClipboardText', path: '/' },
  { label: 'Novo', icon: 'PlusCircle', path: '/relatorios/novo' },
  { label: 'Equipe', icon: 'Users', path: '/usuarios', roles: ROLES_GESTAO },
  { label: 'Perfil', icon: 'User', path: '/perfil' },
] as const
