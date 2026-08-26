import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardText, PlusCircle, User, Users } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/database.types'

export const navIcons: Record<string, Icon> = {
  ClipboardText,
  PlusCircle,
  User,
  Users,
}

interface NavItemConfig {
  label: string
  icon: string
  path: string
  roles?: readonly UserRole[]
}

function NavItem({ item, active }: { item: NavItemConfig; active: boolean }) {
  const navigate = useNavigate()
  const IconComponent = navIcons[item.icon]

  if (!IconComponent) return null

  return (
    <button
      onClick={() => navigate(item.path)}
      className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5"
    >
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-1 bg-bg-base rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">
        <IconComponent
          size={22}
          weight={active ? 'fill' : 'regular'}
          className={cn(
            'transition-colors duration-200',
            active ? 'text-ink-primary' : 'text-white/45',
          )}
        />
      </span>
      <span
        className={cn(
          'relative z-10 text-[10px] font-medium tracking-wide transition-colors duration-200',
          active ? 'text-ink-primary' : 'text-white/45',
        )}
      >
        {item.label}
      </span>
    </button>
  )
}

export function BottomNav() {
  const location = useLocation()
  const role = useAuthStore((s) => s.profile?.role)

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const items = (NAV_ITEMS as readonly NavItemConfig[]).filter(
    (item) => !item.roles || (role && item.roles.includes(role)),
  )

  return (
    <nav
      className="lg:hidden fixed bottom-4 left-1/2 z-40"
      style={{
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '408px',
      }}
    >
      <div className="flex items-center h-[60px] rounded-full bg-dusk px-2">
        {items.map((item) => (
          <NavItem key={item.path} item={item} active={isActive(item.path)} />
        ))}
      </div>
    </nav>
  )
}
