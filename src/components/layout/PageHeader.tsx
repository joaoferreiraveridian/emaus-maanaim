import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUpProps } from '@/lib/motion'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  serif?: boolean
}

export function PageHeader({ title, subtitle, actions, serif = true }: PageHeaderProps) {
  return (
    <motion.header {...fadeUpProps} className="pt-14 pb-5 lg:pt-10 lg:pb-7">
      <div className="flex items-start justify-between">
        <div>
          <h1
            className={
              serif
                ? 'font-display text-displayLg lg:text-displayXl text-ink-primary'
                : 'font-sans text-headingLg font-medium text-ink-primary tracking-tight'
            }
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-bodyMd text-ink-secondary mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 mt-1">
            {actions}
          </div>
        )}
      </div>
      <div
        aria-hidden
        className="h-px w-14 mt-5"
        style={{ background: 'linear-gradient(to right, var(--color-accent-primary), transparent)' }}
      />
    </motion.header>
  )
}
