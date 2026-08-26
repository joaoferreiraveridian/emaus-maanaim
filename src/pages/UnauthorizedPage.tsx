import { ShieldWarning } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'

export function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-bg-base flex items-center justify-center px-5">
      <EmptyState
        icon={<ShieldWarning size={48} />}
        title="Acesso restrito"
        description="Voce nao tem permissao para acessar esta pagina"
        actionLabel="Voltar ao inicio"
        onAction={() => navigate('/', { replace: true })}
      />
    </div>
  )
}
