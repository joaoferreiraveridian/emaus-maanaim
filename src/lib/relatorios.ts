import { supabase } from './supabase'
import type { NovoRelatorio, Relatorio } from '@/types/database.types'

export interface Filtros {
  semana?: number
  anfitriao?: string
  de?: string
  ate?: string
  autorId?: string
}

export async function listarRelatorios(filtros: Filtros = {}): Promise<Relatorio[]> {
  let query = supabase
    .from('relatorios')
    .select('*')
    .order('data_estudo', { ascending: false })

  if (filtros.semana) query = query.eq('semana', filtros.semana)
  if (filtros.anfitriao) query = query.ilike('anfitriao', `%${filtros.anfitriao}%`)
  if (filtros.de) query = query.gte('data_estudo', filtros.de)
  if (filtros.ate) query = query.lte('data_estudo', filtros.ate)
  if (filtros.autorId) query = query.eq('autor_id', filtros.autorId)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function buscarRelatorio(id: string): Promise<Relatorio> {
  const { data, error } = await supabase
    .from('relatorios')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

/** Só o pastor recebe conteúdo — para os demais a RLS devolve vazio. */
export async function buscarSigilo(relatorioId: string): Promise<string | null> {
  const { data } = await supabase
    .from('relatorio_sigilos')
    .select('texto')
    .eq('relatorio_id', relatorioId)
    .maybeSingle()
  return data?.texto ?? null
}

export async function criarRelatorio(
  relatorio: NovoRelatorio,
  sigilo: string,
): Promise<Relatorio> {
  const { data, error } = await supabase
    .from('relatorios')
    .insert(relatorio)
    .select()
    .single()
  if (error) throw error

  if (sigilo.trim()) {
    const { error: sigiloError } = await supabase
      .from('relatorio_sigilos')
      .insert({ relatorio_id: data.id, texto: sigilo.trim() })
    if (sigiloError) throw sigiloError
  }

  return data
}

export { resumir, type Resumo } from './resumo'
