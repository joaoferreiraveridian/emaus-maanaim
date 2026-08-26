/**
 * Checagem do resumo consolidado. Roda com: npx tsx src/lib/relatorios.test.ts
 * (é a única lógica de cálculo do app — o resto é formulário e listagem.)
 */
import assert from 'node:assert/strict'
import { resumir } from './resumo'
import type { Relatorio } from '@/types/database.types'

const base: Relatorio = {
  id: '1',
  autor_id: 'a',
  data_estudo: '2026-01-01',
  semana: 1,
  parte_apostila: 'Lição 1',
  anfitriao: 'Maria',
  ministrador: 'João',
  auxiliares: null,
  presentes: 10,
  visitantes: 2,
  nao_convertidos: 1,
  religioes: null,
  conversoes: 1,
  interessados: null,
  duracao_ok: true,
  duracao_motivo: null,
  membros_ausentes: null,
  dificuldade: null,
  necessita_suporte: false,
  sugestoes: null,
  criado_em: '2026-01-01T00:00:00Z',
}

const vazio = resumir([])
assert.equal(vazio.estudos, 0)
assert.equal(vazio.mediaPresenca, 0, 'sem estudos não pode dividir por zero')
assert.equal(vazio.percentualNoTempo, 0)

const r = resumir([
  base,
  { ...base, id: '2', presentes: 5, conversoes: 0, duracao_ok: false, necessita_suporte: true },
])
assert.equal(r.estudos, 2)
assert.equal(r.presentes, 15)
assert.equal(r.conversoes, 1)
assert.equal(r.visitantes, 4)
assert.equal(r.mediaPresenca, 8, '15 / 2 arredondado')
assert.equal(r.percentualNoTempo, 50, '1 de 2 dentro do tempo')
assert.equal(r.pedidosSuporte, 1)

console.log('ok')
