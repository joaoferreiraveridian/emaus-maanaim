import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, error, hint, iconLeft, iconRight, className, id, ...props },
    ref,
  ) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label font-medium text-ink-secondary tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-bg-surface border border-border-strong',
              'px-[18px] py-3.5 rounded-[14px]',
              'text-bodyMd text-ink-primary font-sans',
              'transition-colors duration-200',
              'focus:border-ink-primary focus:outline-none',
              'placeholder:text-ink-tertiary',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              iconLeft && 'pl-11',
              iconRight && 'pr-11',
              error && 'border-danger focus:border-danger',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-tertiary">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <span className="text-caption text-danger">{error}</span>
        )}
        {hint && !error && (
          <span className="text-caption text-ink-tertiary">{hint}</span>
        )}
      </div>
    )
  },
)
