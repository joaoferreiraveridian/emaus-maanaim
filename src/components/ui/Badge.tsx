import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'accent' | 'success' | 'danger'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-bg-subtle text-ink-primary',
  accent: 'bg-accent-soft text-accent-primary',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-full',
        'text-caption font-medium tracking-wide',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
