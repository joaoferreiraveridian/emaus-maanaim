import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUpProps } from '@/lib/motion'
import { Button } from './Button'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      {...fadeUpProps}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <span className="text-ink-tertiary mb-4">
        {icon}
      </span>
      <h3 className="font-display text-displayMd text-ink-primary mb-2">
        {title}
      </h3>
      <p className="text-bodyMd text-ink-secondary max-w-xs mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
