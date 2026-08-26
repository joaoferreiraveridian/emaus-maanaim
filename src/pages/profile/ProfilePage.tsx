import { useNavigate } from 'react-router-dom'
import { SignOut } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar, Badge, Card, Button } from '@/components/ui'

export function ProfilePage() {
  const navigate = useNavigate()
  const { profile, reset } = useAuthStore()

  async function handleLogout() {
    await supabase.auth.signOut()
    reset()
    navigate('/login', { replace: true })
  }

  if (!profile) return null

  return (
    <div className="lg:max-w-[560px]">
      <PageHeader title="Perfil" />
      <Card className="flex items-center gap-4">
        <Avatar name={profile.nome} src={profile.avatar_url} size="lg" />
        <div>
          <p className="text-bodyLg font-medium text-ink-primary">{profile.nome}</p>
          <Badge>{profile.role}</Badge>
        </div>
      </Card>
      <Button variant="ghost" fullWidth icon={<SignOut size={18} />} onClick={handleLogout} className="mt-6">
        Sair
      </Button>
    </div>
  )
}
