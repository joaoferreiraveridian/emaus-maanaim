import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'hero' | 'flat'
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    {
      variant = 'default',
      interactive = false,
      padding = 'md',
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <motion.div
        ref={ref}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        whileHover={interactive ? { y: -2 } : undefined}
        transition={{ duration: 0.2 }}
        className={cn(
          'bg-bg-surface border border-border-subtle',
          variant === 'default' && 'rounded-xl shadow-sm',
          variant === 'hero' && 'rounded-2xl shadow-md overflow-hidden',
          variant === 'flat' && 'rounded-xl shadow-none',
          interactive && 'cursor-pointer',
          paddingStyles[padding],
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
