import { supabase } from './supabase'
import type { ConvitePendente, Profile, UserRole } from '@/types/database.types'

export async function listarUsuarios(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('nome')
  if (error) throw error
  return data ?? []
}

/** Só o pastor consegue de fato mudar algo — a função no banco recusa qualquer outro papel. */
export async function promoverUsuario(usuarioId: string, novoPapel: UserRole): Promise<void> {
  const { error } = await supabase.rpc('promover_usuario', {
    usuario_id: usuarioId,
    novo_papel: novoPapel,
  })
  if (error) throw error
}

/** Desativar não apaga nada — só derruba o acesso. Reversível. */
export async function alterarStatusUsuario(usuarioId: string, novoAtivo: boolean): Promise<void> {
  const { error } = await supabase.rpc('alterar_status_usuario', {
    usuario_id: usuarioId,
    novo_ativo: novoAtivo,
  })
  if (error) throw error
}

export async function listarConvitesPendentes(): Promise<ConvitePendente[]> {
  const { data, error } = await supabase
    .from('convites_pendentes')
    .select('*')
    .order('criado_em', { ascending: false })
  if (error) throw error
  return data ?? []
}

/** Libera o e-mail para se cadastrar. Sem envio de nada — a pessoa cria a conta sozinha. */
export async function liberarEmail(email: string, role: UserRole): Promise<void> {
  const { data: auth } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('convites_pendentes')
    .insert({ email, role, convidado_por: auth.user!.id })
  if (error) throw error
}

export async function cancelarConvite(email: string): Promise<void> {
  const { error } = await supabase.from('convites_pendentes').delete().eq('email', email)
  if (error) throw error
}
