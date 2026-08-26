import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SignOut } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { Logo } from '@/components/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { NAV_ITEMS } from '@/lib/constants'
import { navIcons } from '@/components/ui/BottomNav'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

/** Navegação lateral — só existe em telas grandes; no celular quem manda é a BottomNav. */
export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, reset } = useAuthStore()

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  async function handleLogout() {
    await supabase.auth.signOut()
    reset()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className="hidden lg:flex sticky top-0 h-dvh w-[264px] shrink-0 flex-col"
      style={{ background: '#1B2634' }}
    >
      {/* Marca */}
      <div className="px-6 pt-8 pb-7">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.07)',
            }}
          >
            <Logo size={21} color="#ffffff" />
          </div>
          <div>
            <p className="font-display text-white text-headingSm leading-none">Emaús</p>
            <p
              className="font-sans mt-1"
              style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              Maanaim
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {NAV_ITEMS.filter((item) => !('roles' in item) || (!!profile && item.roles.includes(profile.role))).map((item) => {
          const IconComponent = navIcons[item.icon]
          const active = isActive(item.path)
          if (!IconComponent) return null

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-bodySm font-medium',
                'transition-colors duration-200',
                active ? 'text-white' : 'text-white/45 hover:text-white/75 hover:bg-white/5',
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-indicator"
                  aria-hidden
                  className="absolute inset-0 rounded-[12px] bg-white/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex">
                <IconComponent size={19} weight={active ? 'fill' : 'regular'} />
              </span>
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Usuário */}
      {profile && (
        <div className="px-3 pb-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={profile.nome} src={profile.avatar_url} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-bodySm font-medium text-white truncate">{profile.nome}</p>
              <p className="text-caption text-white/35 capitalize">{profile.role}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              aria-label="Sair"
              className="shrink-0 text-white/35 hover:text-white/80 transition-colors duration-200"
            >
              <SignOut size={17} />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
