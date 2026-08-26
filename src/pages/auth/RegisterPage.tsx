import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EnvelopeSimple, Lock, UserCircle, Eye, EyeSlash } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'

/**
 * Cadastro só funciona para e-mails que o pastor liberou na tela Equipe —
 * a trigger handle_new_user recusa qualquer outro e devolve o erro abaixo.
 */
export function RegisterPage() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    })
    if (authError) {
      setError(
        authError.message.includes('Database error')
          ? 'Este e-mail não foi liberado pela liderança. Peça para o pastor te liberar na Equipe.'
          : authError.message,
      )
      setLoading(false)
      return
    }
    navigate('/', { replace: true })
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

        <h1 className="font-display text-displayLg text-ink-primary mb-2">Criar sua conta</h1>
        <p className="text-bodyMd text-ink-tertiary mb-8">
          Só funciona se o pastor já liberou seu e-mail na Equipe.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-label font-medium text-ink-secondary block mb-2" htmlFor="reg-nome">
              Nome completo
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary">
                <UserCircle size={16} />
              </span>
              <input
                id="reg-nome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                autoComplete="name"
                className="w-full bg-bg-surface border border-border-strong rounded-[14px] pl-11 pr-4 py-3.5 text-bodyMd text-ink-primary focus:border-ink-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-label font-medium text-ink-secondary block mb-2" htmlFor="reg-email">
              E-mail
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary">
                <EnvelopeSimple size={16} />
              </span>
              <input
                id="reg-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-bg-surface border border-border-strong rounded-[14px] pl-11 pr-4 py-3.5 text-bodyMd text-ink-primary focus:border-ink-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-label font-medium text-ink-secondary block mb-2" htmlFor="reg-password">
              Senha
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary">
                <Lock size={16} />
              </span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className={`w-full bg-bg-surface border rounded-[14px] pl-11 pr-11 py-3.5 text-bodyMd text-ink-primary focus:outline-none ${error ? 'border-danger' : 'border-border-strong focus:border-ink-primary'}`}
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

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Criar conta
          </Button>
        </form>

        <p className="text-bodySm text-ink-tertiary text-center mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-ink-primary font-semibold underline underline-offset-2">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
