import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { LockKey } from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/authStore'
import { criarRelatorio } from '@/lib/relatorios'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button, Card, DatePicker, Input, Textarea, Toggle } from '@/components/ui'
import { staggeredFadeUp } from '@/lib/motion'
import type { NovoRelatorio } from '@/types/database.types'

const hoje = () => new Date().toISOString().slice(0, 10)

const TOTAL_SECOES = 6

function Secao({ titulo, indice, children }: { titulo: string; indice: number; children: React.ReactNode }) {
  return (
    <motion.section {...staggeredFadeUp(indice)} className="relative pl-[2.25rem] mb-5">
      {indice < TOTAL_SECOES - 1 && (
        <span aria-hidden className="absolute left-[11px] top-6 bottom-[-1.25rem] w-px bg-border-default" />
      )}
      <span
        aria-hidden
        className="absolute left-0 top-0 w-[23px] h-[23px] rounded-full bg-accent-primary text-white text-[11px] font-semibold flex items-center justify-center"
      >
        {indice + 1}
      </span>
      <h2 className="text-label font-medium text-ink-tertiary tracking-wide uppercase mb-3 leading-[23px]">
        {titulo}
      </h2>
      {/* No desktop os campos curtos vão em duas colunas; os longos usam lg:col-span-2. */}
      <Card className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-5">{children}</Card>
    </motion.section>
  )
}

export function NovoRelatorioPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const profile = useAuthStore((s) => s.profile)

  const [form, setForm] = useState<NovoRelatorio>({
    autor_id: profile?.id ?? '',
    data_estudo: hoje(),
    semana: 1,
    parte_apostila: '',
    anfitriao: '',
    ministrador: profile?.nome ?? '',
    auxiliares: '',
    presentes: 0,
    visitantes: 0,
    nao_convertidos: 0,
    religioes: '',
    conversoes: 0,
    interessados: '',
    duracao_ok: true,
    duracao_motivo: '',
    membros_ausentes: '',
    dificuldade: '',
    necessita_suporte: false,
    sugestoes: '',
  })
  const [sigilo, setSigilo] = useState('')

  const set = <K extends keyof NovoRelatorio>(campo: K, valor: NovoRelatorio[K]) =>
    setForm((atual) => ({ ...atual, [campo]: valor }))

  const numero = (campo: 'semana' | 'presentes' | 'visitantes' | 'nao_convertidos' | 'conversoes') => ({
    type: 'number',
    min: 0,
    inputMode: 'numeric' as const,
    value: String(form[campo]),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      set(campo, Number(e.target.value) || 0),
  })

  const texto = (campo: keyof NovoRelatorio) => ({
    value: (form[campo] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(campo, e.target.value as NovoRelatorio[typeof campo]),
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => criarRelatorio(form, sigilo),
    onSuccess: (relatorio) => {
      queryClient.invalidateQueries({ queryKey: ['relatorios'] })
      navigate(`/relatorios/${relatorio.id}`, { replace: true })
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="lg:max-w-[860px]">
      <PageHeader title="Novo relatório" subtitle="Estudo na casa" />

      <Secao titulo="O estudo" indice={0}>
        <DatePicker
          label="Data"
          value={form.data_estudo}
          onChange={(v) => set('data_estudo', v)}
        />
        <Input label="Semana do estudo" required {...numero('semana')} />
        <div className="lg:col-span-2">
          <Input
            label="Parte da apostila ensinada"
            required
            placeholder="Ex.: Lição 3 — páginas 12 a 18"
            {...texto('parte_apostila')}
          />
        </div>
        <Input label="Anfitrião da casa" required {...texto('anfitriao')} />
        <Input label="Ministrador" required {...texto('ministrador')} />
        <div className="lg:col-span-2">
          <Input
            label="Auxiliares"
            placeholder="Separe os nomes por vírgula"
            {...texto('auxiliares')}
          />
        </div>
      </Secao>

      <Secao titulo="Presença" indice={1}>
        <Input label="Total de presentes" required {...numero('presentes')} />
        <Input label="Visitantes" {...numero('visitantes')} />
        <Input label="Não convertidos" {...numero('nao_convertidos')} />
        <div className="lg:col-span-2">
          <Input
            label="Eram de alguma religião?"
            placeholder="Se sim, qual"
            {...texto('religioes')}
          />
        </div>
      </Secao>

      <Secao titulo="Resultado" indice={2}>
        <Input label="Conversões" {...numero('conversoes')} />
        <div className="lg:col-span-2">
          <Textarea
            label="Interessados em receber o estudo em casa"
            placeholder="Nome e contato de quem se ofereceu"
            {...texto('interessados')}
          />
        </div>
      </Secao>

      <Secao titulo="Duração" indice={3}>
        <div className="lg:col-span-2">
          <Toggle
            label="Durou o esperado (1h10)?"
            value={form.duracao_ok}
            onChange={(v) => set('duracao_ok', v)}
          />
        </div>
        {!form.duracao_ok && (
          <div className="lg:col-span-2">
            <Textarea label="Por que não durou?" required {...texto('duracao_motivo')} />
          </div>
        )}
      </Secao>

      <Secao titulo="Atenção da liderança" indice={4}>
        <Textarea
          label="Membros Maanaim ausentes ou pouco assíduos"
          placeholder="Nomes, se houver"
          {...texto('membros_ausentes')}
        />
        <Textarea
          label="Dificuldade com o estudo"
          placeholder="Deixe em branco se não houve"
          {...texto('dificuldade')}
        />
        <Toggle
          label="Necessita de suporte?"
          value={form.necessita_suporte}
          onChange={(v) => set('necessita_suporte', v)}
        />
        <Textarea label="Sugestões" {...texto('sugestoes')} />
      </Secao>


      <Secao titulo="Sigilo" indice={5}>
        <div className="lg:col-span-2">
          <Textarea
            label="Somente para o Pastor André"
            hint="Ninguém mais lê este campo — nem a liderança, nem você depois de enviar."
            placeholder="Deixe em branco se não houver nada"
            value={sigilo}
            onChange={(e) => setSigilo(e.target.value)}
          />
        </div>
        <p className="lg:col-span-2 flex items-center gap-2 text-caption text-ink-tertiary">
          <LockKey size={14} />
          Enviado em separado do relatório.
        </p>
      </Secao>

      {error && (
        <p className="text-caption text-danger mb-3">
          Não foi possível enviar: {(error as Error).message}
        </p>
      )}

      <Button type="submit" fullWidth size="lg" loading={isPending} className="lg:w-auto">
        Enviar relatório
      </Button>
    </form>
  )
}
