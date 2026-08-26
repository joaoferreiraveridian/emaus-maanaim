import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FunnelSimple, Plus, ClipboardText, Warning } from '@phosphor-icons/react'
import { listarRelatorios, resumir, type Filtros } from '@/lib/relatorios'
import { listarUsuarios } from '@/lib/usuarios'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { ROLES_GESTAO } from '@/lib/constants'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge, Button, Card, DatePicker, EmptyState, Input, Select, SkeletonCard } from '@/components/ui'
import { staggeredFadeUp } from '@/lib/motion'

export function RelatoriosPage() {
  const navigate = useNavigate()
  const [filtros, setFiltros] = useState<Filtros>({})
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const role = useAuthStore((s) => s.profile?.role)
  const souGestao = !!role && ROLES_GESTAO.includes(role)

  const { data: relatorios, isLoading } = useQuery({
    queryKey: ['relatorios', filtros],
    queryFn: () => listarRelatorios(filtros),
  })

  const { data: usuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: listarUsuarios,
    enabled: souGestao,
  })

  const resumo = resumir(relatorios ?? [])

  return (
    <>
      <PageHeader
        title="Relatórios"
        subtitle="Projeto Emaús · Igreja do Nazareno Maanaim"
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<FunnelSimple size={16} />}
            onClick={() => setMostrarFiltros((v) => !v)}
          >
            Filtrar
          </Button>
        }
      />

      {mostrarFiltros && (
        <motion.div {...staggeredFadeUp(0)}>
          <Card className="flex flex-col gap-3 mb-5 lg:grid lg:grid-cols-5 lg:items-end lg:gap-4">
            {souGestao && (
              <Select
                label="Ministrador"
                value={filtros.autorId ?? ''}
                onChange={(v) => setFiltros((f) => ({ ...f, autorId: v || undefined }))}
                options={[
                  { value: '', label: 'Todos' },
                  ...(usuarios?.map((u) => ({ value: u.id, label: u.nome })) ?? []),
                ]}
              />
            )}
            <Input
              label="Semana"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="Todas"
              value={filtros.semana ?? ''}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, semana: Number(e.target.value) || undefined }))
              }
            />
            <Input
              label="Anfitrião"
              placeholder="Todos"
              value={filtros.anfitriao ?? ''}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, anfitriao: e.target.value || undefined }))
              }
            />
            <div className="grid grid-cols-2 gap-3 lg:contents">
              <DatePicker
                label="De"
                value={filtros.de ?? ''}
                onChange={(v) => setFiltros((f) => ({ ...f, de: v || undefined }))}
              />
              <DatePicker
                label="Até"
                value={filtros.ate ?? ''}
                onChange={(v) => setFiltros((f) => ({ ...f, ate: v || undefined }))}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFiltros({})}>
              Limpar filtros
            </Button>
          </Card>
        </motion.div>
      )}

      {!isLoading && resumo.estudos > 0 && (
        <motion.div {...staggeredFadeUp(1)} className="mb-6">
          <Card padding="none">
            <div className="px-5 py-3 bg-dusk-soft border-b border-border-subtle rounded-t-xl">
              <p className="text-caption font-semibold text-dusk uppercase tracking-wide">
                Resumo do período
              </p>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-6">
              <Numero rotulo="Estudos" valor={resumo.estudos} />
              <Numero rotulo="Presentes" valor={resumo.presentes} />
              <Numero rotulo="Conversões" valor={resumo.conversoes} destaque />
              <Numero rotulo="Média/estudo" valor={resumo.mediaPresenca} />
              <Numero rotulo="Visitantes" valor={resumo.visitantes} />
              <Numero rotulo="No tempo" valor={`${resumo.percentualNoTempo}%`} />
            </div>
          </Card>
        </motion.div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!isLoading && !relatorios?.length && (
        <EmptyState
          icon={<ClipboardText size={40} />}
          title="Nenhum relatório"
          description="Assim que um estudo for registrado, ele aparece aqui."
          actionLabel="Novo relatório"
          onAction={() => navigate('/relatorios/novo')}
        />
      )}

      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {relatorios?.map((r, i) => (
          <motion.div key={r.id} {...staggeredFadeUp(i)}>
            <Card interactive onClick={() => navigate(`/relatorios/${r.id}`)}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-bodyLg font-medium text-ink-primary">
                    Casa de {r.anfitriao}
                  </p>
                  <p className="text-bodySm text-ink-secondary mt-0.5">
                    Semana {r.semana} · {formatDate(r.data_estudo)} · {r.ministrador}
                  </p>
                </div>
                {r.necessita_suporte && (
                  <span className="text-warning shrink-0" title="Necessita suporte">
                    <Warning size={18} weight="fill" />
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge>{r.presentes} presentes</Badge>
                {r.visitantes > 0 && <Badge>{r.visitantes} visitantes</Badge>}
                {r.conversoes > 0 && (
                  <Badge variant="success">{r.conversoes} conversões</Badge>
                )}
                {!r.duracao_ok && <Badge variant="danger">Fora do tempo</Badge>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quando a lista está vazia o EmptyState já traz o CTA — não repete. */}
      {!!relatorios?.length && (
        <Button
          fullWidth
          size="lg"
          icon={<Plus size={18} />}
          className="mt-6 lg:w-auto"
          onClick={() => navigate('/relatorios/novo')}
        >
          Novo relatório
        </Button>
      )}
    </>
  )
}

function Numero({
  rotulo,
  valor,
  destaque,
}: {
  rotulo: string
  valor: number | string
  destaque?: boolean
}) {
  return (
    <div className="px-4 py-3.5 border-b border-r border-border-subtle [&:nth-child(3n)]:border-r-0 [&:nth-last-child(-n+3)]:border-b-0 lg:py-5 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(6n)]:border-r-0 lg:border-b-0">
      <p className="text-caption text-ink-tertiary truncate">{rotulo}</p>
      <p
        className={`font-sans font-semibold text-headingLg tabular-nums mt-0.5 ${
          destaque ? 'text-accent-primary' : 'text-ink-primary'
        }`}
      >
        {valor}
      </p>
    </div>
  )
}
