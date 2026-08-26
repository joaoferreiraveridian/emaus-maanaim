import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeSlash } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'

/**
 * Destino do link de convite (supabase.auth.admin.inviteUserByEmail). Quem chega
 * aqui já está autenticado pelo link — só falta criar a senha de verdade.
 */
export function DefinirSenhaPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuthStore()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }
    navigate('/', { replace: true })
  }

  if (loading) return null

  if (!user) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg-base px-5 text-center">
        <div>
          <p className="text-headingMd text-ink-primary mb-2">Link inválido ou expirado</p>
          <p className="text-bodyMd text-ink-secondary mb-6">
            Peça ao pastor ou ao líder para te convidar de novo.
          </p>
          <Button onClick={() => navigate('/login')}>Ir para o login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-base px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-dusk flex items-center justify-center shrink-0">
            <Logo size={22} color="#ffffff" />
          </div>
          <span className="font-sans font-semibold text-ink-secondary text-[0.7rem] tracking-[0.14em] uppercase">
            Emaús
          </span>
        </div>

        <h1 className="font-display text-displayLg text-ink-primary mb-2">Bem-vindo(a)</h1>
        <p className="text-bodyMd text-ink-tertiary mb-8">
          Crie uma senha para começar a usar o Emaús.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-label font-medium text-ink-secondary block mb-2" htmlFor="nova-senha">
              Senha
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary">
                <Lock size={16} />
              </span>
              <input
                id="nova-senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                autoFocus
                className="w-full bg-bg-surface border border-border-strong rounded-[14px] pl-11 pr-11 py-3.5 text-bodyMd text-ink-primary focus:border-ink-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-tertiary"
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-caption text-danger mt-2">{error}</p>}
          </div>

          <Button type="submit" fullWidth size="lg" loading={saving}>
            Entrar no Emaús
          </Button>
        </form>
      </div>
    </div>
  )
}
