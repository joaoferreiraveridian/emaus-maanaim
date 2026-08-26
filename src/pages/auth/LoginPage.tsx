import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EnvelopeSimple, Lock, Eye, EyeSlash } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: i * 0.07, ease },
})

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Email ou senha incorretos')
      setLoading(false)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-dvh flex">

      {/* ── LEFT — Form panel ── */}
      <div className="flex-1 flex flex-col bg-bg-base relative lg:max-w-[460px]" style={{ overflowY: 'auto' }}>

        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230A0A0A'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div
          className="flex-1 flex flex-col justify-center relative z-10"
          style={{ padding: 'clamp(1.5rem, 5vh, 3rem) clamp(1.5rem, 5vw, 2.5rem)' }}
        >

          {/* Logo */}
          <motion.div {...stagger(0)} style={{ marginBottom: 'clamp(1.25rem, 3vh, 2.5rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'clamp(1.25rem, 3vh, 2.5rem)' }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: '#1B2634',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(27,38,52,0.25)',
                  flexShrink: 0,
                }}
              >
                <Logo size={22} color="#ffffff" />
              </div>
              <span className="font-sans font-semibold text-ink-secondary" style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Emaús
              </span>
            </div>

            <h1
              className="font-display text-ink-primary"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}
            >
              Bem-vindo<br />de volta
            </h1>
            <p className="font-sans text-ink-tertiary" style={{ fontSize: '0.9rem' }}>
              Entre com sua conta para continuar
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.875rem, 2vh, 1.25rem)' }}>
            <motion.div {...stagger(1)}>
              <label
                className="font-sans font-medium text-ink-secondary"
                style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '0.03em', marginBottom: '0.5rem' }}
                htmlFor="login-email"
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(34,27,20,0.4)', display: 'flex' }}>
                  <EnvelopeSimple size={16} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="font-sans text-ink-primary"
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(34,27,20,0.16)',
                    borderRadius: 12,
                    padding: '0.875rem 1rem 0.875rem 2.75rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#221B14')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(34,27,20,0.16)')}
                />
              </div>
            </motion.div>

            <motion.div {...stagger(2)}>
              <label
                className="font-sans font-medium text-ink-secondary"
                style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '0.03em', marginBottom: '0.5rem' }}
                htmlFor="login-password"
              >
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(34,27,20,0.4)', display: 'flex' }}>
                  <Lock size={16} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="font-sans text-ink-primary"
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: `1.5px solid ${error ? '#E03C3C' : 'rgba(34,27,20,0.16)'}`,
                    borderRadius: 12,
                    padding: '0.875rem 3rem 0.875rem 2.75rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#221B14')}
                  onBlur={(e) => (e.target.style.borderColor = error ? '#E03C3C' : 'rgba(34,27,20,0.16)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(34,27,20,0.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p className="font-sans" style={{ color: '#E03C3C', fontSize: '0.78rem', marginTop: '0.375rem' }}>{error}</p>
              )}
            </motion.div>

            <motion.div {...stagger(3)} style={{ paddingTop: '0.25rem' }}>
              <Button type="submit" fullWidth loading={loading} size="lg">
                Entrar
              </Button>
            </motion.div>
          </form>

          <motion.p
            {...stagger(4)}
            className="font-sans text-ink-tertiary"
            style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: 'clamp(1rem, 2.5vh, 1.75rem)' }}
          >
            Seu e-mail já foi liberado?{' '}
            <Link
              to="/cadastro"
              className="text-ink-primary font-semibold"
              style={{ textDecoration: 'underline', textDecorationColor: 'rgba(34,27,20,0.32)', textUnderlineOffset: 3 }}
            >
              Criar conta
            </Link>
          </motion.p>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10"
          style={{ padding: '0 clamp(1.5rem, 5vw, 2.5rem) 1.5rem' }}
        >
          <p className="font-sans text-ink-disabled" style={{ fontSize: '0.72rem' }}>
            Igreja do Nazareno Maanaim © 2026
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT — Brand panel (desktop only) ── */}
      <div
        className="hidden lg:flex flex-1 flex-col relative overflow-hidden"
        style={{ background: '#1B2634' }}
      >
        {/* Diagonal light beams */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(135deg, rgba(193,98,43,0.05) 0%, transparent 50%),
              linear-gradient(225deg, rgba(193,98,43,0.04) 0%, transparent 60%)
            `,
          }}
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Glow spot */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(193,98,43,0.10) 0%, transparent 65%)',
          }}
        />

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between px-14 py-14 relative z-10">

          {/* Top: Brand monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="flex flex-col items-center justify-center flex-1"
          >
            {/* Símbolo da igreja */}
            <div className="relative mb-16">
              <Logo size={200} color="rgba(255,255,255,0.10)" />
              {/* Accent dot */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 12,
                  height: 12,
                  background: '#C1622B',
                  bottom: '18%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 24px rgba(193,98,43,0.6)',
                }}
              />
            </div>

            {/* Brand text */}
            <div className="text-center">
              <p
                className="font-display font-bold"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1.6rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Igreja do Nazareno Maanaim
              </p>
              <p
                className="mt-2"
                style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', letterSpacing: '0.04em' }}
              >
                Projeto Emaús · Estudo na casa
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
