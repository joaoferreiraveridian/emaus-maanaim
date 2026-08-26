import type { Relatorio } from '@/types/database.types'

export interface Resumo {
  estudos: number
  presentes: number
  conversoes: number
  visitantes: number
  mediaPresenca: number
  percentualNoTempo: number
  pedidosSuporte: number
}

export function resumir(relatorios: Relatorio[]): Resumo {
  const estudos = relatorios.length
  const soma = (campo: 'presentes' | 'conversoes' | 'visitantes') =>
    relatorios.reduce((total, r) => total + r[campo], 0)

  const presentes = soma('presentes')
  const noTempo = relatorios.filter((r) => r.duracao_ok).length

  return {
    estudos,
    presentes,
    conversoes: soma('conversoes'),
    visitantes: soma('visitantes'),
    mediaPresenca: estudos ? Math.round(presentes / estudos) : 0,
    percentualNoTempo: estudos ? Math.round((noTempo / estudos) * 100) : 0,
    pedidosSuporte: relatorios.filter((r) => r.necessita_suporte).length,
  }
}
