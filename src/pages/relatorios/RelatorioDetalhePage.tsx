import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, LockKey, Warning } from '@phosphor-icons/react'
import { buscarRelatorio, buscarSigilo } from '@/lib/relatorios'
import { formatDateFull } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge, Button, Card, SkeletonCard } from '@/components/ui'

function Linha({ rotulo, valor }: { rotulo: string; valor: string | number | null }) {
  if (valor === null || valor === '') return null
  return (
    <div className="py-2.5 border-b border-border-subtle last:border-0">
      <p className="text-caption text-ink-tertiary">{rotulo}</p>
      <p className="text-bodyMd text-ink-primary mt-0.5 whitespace-pre-wrap">{valor}</p>
    </div>
  )
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 break-inside-avoid">
      <h2 className="text-label font-medium text-ink-tertiary tracking-wide uppercase mb-3">{titulo}</h2>
      <Card className="flex flex-col gap-4">{children}</Card>
    </section>
  )
}

export function RelatorioDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const ehPastor = useAuthStore((s) => s.profile?.role) === 'pastor'

  const { data: r, isLoading } = useQuery({
    queryKey: ['relatorio', id],
    queryFn: () => buscarRelatorio(id!),
    enabled: !!id,
  })

  const { data: sigilo } = useQuery({
    queryKey: ['sigilo', id],
    queryFn: () => buscarSigilo(id!),
    enabled: !!id && ehPastor,
  })

  if (isLoading || !r) {
    return (
      <>
        <PageHeader title="Relatório" />
        <SkeletonCard />
      </>
    )
  }

  const temAlerta = !!(r.membros_ausentes || r.dificuldade || r.necessita_suporte || r.sugestoes)

  return (
    <>
      <PageHeader
        title={`Casa de ${r.anfitriao}`}
        subtitle={`Semana ${r.semana} · ${formatDateFull(r.data_estudo)}`}
        serif={false}
        actions={
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/')}>
            Voltar
          </Button>
        }
      />

      <div className="lg:columns-2 lg:gap-4">
        <Secao titulo="O estudo">
          <Linha rotulo="Parte da apostila" valor={r.parte_apostila} />
          <Linha rotulo="Ministrador" valor={r.ministrador} />
          <Linha rotulo="Auxiliares" valor={r.auxiliares} />
        </Secao>

        <Secao titulo="Presença e resultado">
          <Linha rotulo="Presentes" valor={r.presentes} />
          <Linha rotulo="Visitantes" valor={r.visitantes} />
          <Linha rotulo="Não convertidos" valor={r.nao_convertidos} />
          <Linha rotulo="Religião de origem" valor={r.religioes} />
          <Linha rotulo="Conversões" valor={r.conversoes} />
          <Linha rotulo="Interessados em receber o estudo" valor={r.interessados} />
        </Secao>

        <Secao titulo="Duração">
          <Linha rotulo="Duração" valor={r.duracao_ok ? 'Dentro do previsto (1h10)' : 'Fora do previsto'} />
          <Linha rotulo="Motivo" valor={r.duracao_motivo} />
        </Secao>

        {temAlerta && (
          <section className="mb-5 break-inside-avoid">
            <h2 className="flex items-center gap-1.5 text-label font-medium text-warning tracking-wide uppercase mb-3">
              <Warning size={14} weight="fill" />
              Atenção da liderança
            </h2>
            <Card className="flex flex-col gap-4 border-warning/30 bg-warning/5">
              <Linha rotulo="Membros ausentes ou pouco assíduos" valor={r.membros_ausentes} />
              <Linha rotulo="Dificuldade com o estudo" valor={r.dificuldade} />
              {r.necessita_suporte && (
                <div className="py-2.5 border-b border-border-subtle last:border-0">
                  <Badge variant="danger">Necessita de suporte</Badge>
                </div>
              )}
              <Linha rotulo="Sugestões" valor={r.sugestoes} />
            </Card>
          </section>
        )}

        {ehPastor && sigilo && (
          <section className="mb-5 break-inside-avoid">
            <h2 className="flex items-center gap-1.5 text-label font-medium text-accent-primary tracking-wide uppercase mb-3">
              <LockKey size={14} weight="fill" />
              Sigiloso — somente pastor
            </h2>
            <Card className="border-accent-primary">
              <p className="text-bodyMd text-ink-primary whitespace-pre-wrap">{sigilo}</p>
            </Card>
          </section>
        )}
      </div>
    </>
  )
}
