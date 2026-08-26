import { useState, type FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserPlus, X } from '@phosphor-icons/react'
import {
  listarUsuarios,
  promoverUsuario,
  alterarStatusUsuario,
  listarConvitesPendentes,
  liberarEmail,
  cancelarConvite,
} from '@/lib/usuarios'
import { useAuthStore } from '@/stores/authStore'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar, Badge, Button, Card, Input, Modal, SkeletonCard } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Profile, UserRole } from '@/types/database.types'

const PAPEIS: { valor: UserRole; rotulo: string }[] = [
  { valor: 'ministrador', rotulo: 'Ministrador' },
  { valor: 'lider', rotulo: 'Líder' },
  { valor: 'pastor', rotulo: 'Pastor' },
]

function SeletorPapel({
  valor,
  onEscolher,
  desabilitado,
}: {
  valor: UserRole
  onEscolher: (papel: UserRole) => void
  desabilitado?: boolean
}) {
  return (
    <div className="flex gap-1.5 mt-2">
      {PAPEIS.map((p) => (
        <button
          key={p.valor}
          type="button"
          disabled={desabilitado}
          onClick={() => onEscolher(p.valor)}
          className={cn(
            'px-3 py-1.5 rounded-full text-caption font-medium border transition-colors duration-200',
            valor === p.valor
              ? 'bg-ink-primary text-white border-ink-primary'
              : 'bg-transparent text-ink-secondary border-border-default hover:bg-bg-subtle',
            desabilitado && 'opacity-50',
          )}
        >
          {p.rotulo}
        </button>
      ))}
    </div>
  )
}

function ModalLiberarEmail({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('ministrador')

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: () => liberarEmail(email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convites-pendentes'] })
      setEmail('')
      setRole('ministrador')
      onClose()
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    mutate()
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title="Liberar e-mail"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <span className="text-label font-medium text-ink-secondary tracking-wide">Papel</span>
          <SeletorPapel valor={role} onEscolher={setRole} />
        </div>
        <p className="text-caption text-ink-tertiary">
          A pessoa cria a própria conta e senha na tela de login, em "Criar conta".
        </p>
        {error && <p className="text-caption text-danger">{(error as Error).message}</p>}
        <Button type="submit" fullWidth loading={isPending}>
          Liberar e-mail
        </Button>
      </form>
    </Modal>
  )
}

function LinhaConvitePendente({ email, role }: { email: string; role: UserRole }) {
  const queryClient = useQueryClient()
  const { mutate: cancelar, isPending } = useMutation({
    mutationFn: () => cancelarConvite(email),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['convites-pendentes'] }),
  })

  return (
    <Card className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center shrink-0">
        <UserPlus size={18} className="text-ink-tertiary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-bodyMd font-medium text-ink-primary truncate">{email}</p>
        <Badge className="mt-1.5 capitalize">{role}</Badge>
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => cancelar()}
        title="Cancelar liberação"
        className="shrink-0 text-ink-tertiary hover:text-danger transition-colors disabled:opacity-50"
      >
        <X size={18} />
      </button>
    </Card>
  )
}

function LinhaUsuario({
  u,
  souPastor,
  ehVoceMesmo,
}: {
  u: Profile
  souPastor: boolean
  ehVoceMesmo: boolean
}) {
  const queryClient = useQueryClient()
  const podeEditar = souPastor && !ehVoceMesmo

  const { mutate: promover, isPending: promovendo } = useMutation({
    mutationFn: (papel: UserRole) => promoverUsuario(u.id, papel),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  })

  const { mutate: alterarStatus, isPending: alterandoStatus } = useMutation({
    mutationFn: (ativo: boolean) => alterarStatusUsuario(u.id, ativo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  })

  return (
    <Card className={cn('flex items-center gap-4', !u.ativo && 'opacity-50')}>
      <Avatar name={u.nome} src={u.avatar_url} />
      <div className="flex-1 min-w-0">
        <p className="text-bodyMd font-medium text-ink-primary truncate flex items-center gap-2">
          {u.nome}
          {ehVoceMesmo && <span className="text-ink-tertiary font-normal">· você</span>}
          {!u.ativo && <Badge variant="danger">Inativo</Badge>}
        </p>

        {podeEditar ? (
          <SeletorPapel valor={u.role} onEscolher={promover} desabilitado={promovendo || alterandoStatus} />
        ) : (
          <Badge variant={u.role === 'pastor' ? 'accent' : 'default'} className="mt-1.5 capitalize">
            {u.role}
          </Badge>
        )}
      </div>

      {podeEditar && (
        <button
          type="button"
          disabled={alterandoStatus || promovendo}
          onClick={() => alterarStatus(!u.ativo)}
          className="shrink-0 text-caption font-medium text-ink-tertiary hover:text-danger transition-colors disabled:opacity-50"
        >
          {u.ativo ? 'Desativar' : 'Reativar'}
        </button>
      )}
    </Card>
  )
}

export function UsuariosPage() {
  const profile = useAuthStore((s) => s.profile)
  const [liberando, setLiberando] = useState(false)

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: listarUsuarios,
  })

  const souPastor = profile?.role === 'pastor'

  const { data: convites } = useQuery({
    queryKey: ['convites-pendentes'],
    queryFn: listarConvitesPendentes,
    enabled: souPastor,
  })

  return (
    <>
      <PageHeader
        title="Equipe"
        subtitle={souPastor ? 'Libere e-mails, promova ou desative acessos' : 'Somente o pastor altera a equipe'}
        actions={
          souPastor && (
            <Button size="sm" icon={<UserPlus size={16} />} onClick={() => setLiberando(true)}>
              Liberar e-mail
            </Button>
          )
        }
      />

      {isLoading && (
        <div className="flex flex-col gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!!convites?.length && (
        <div className="mb-5">
          <p className="text-label font-medium text-ink-tertiary tracking-wide uppercase mb-3">
            Aguardando cadastro
          </p>
          <div className="flex flex-col gap-3">
            {convites.map((c) => (
              <LinhaConvitePendente key={c.email} email={c.email} role={c.role} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {usuarios?.map((u) => (
          <LinhaUsuario key={u.id} u={u} souPastor={souPastor} ehVoceMesmo={u.id === profile?.id} />
        ))}
      </div>

      <ModalLiberarEmail open={liberando} onClose={() => setLiberando(false)} />
    </>
  )
}
