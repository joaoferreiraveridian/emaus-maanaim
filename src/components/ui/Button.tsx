import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-ink-primary text-white hover:opacity-92',
  secondary: 'bg-transparent border border-border-default text-ink-primary hover:bg-bg-subtle',
  ghost: 'bg-transparent text-ink-primary hover:bg-bg-subtle',
  danger: 'bg-danger text-white hover:opacity-92',
  accent: 'bg-accent-primary text-white hover:opacity-92',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-bodySm gap-1.5',
  md: 'px-7 py-4 text-bodyMd gap-2',
  lg: 'px-8 py-4.5 text-bodyLg gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = 'left',
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full',
          'transition-colors duration-200 select-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </motion.button>
    )
  },
)
