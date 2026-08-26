import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, hint, className, id, ...props }, ref) {
    const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className="text-label font-medium text-ink-secondary tracking-wide"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          rows={3}
          className={cn(
            'w-full bg-bg-surface border border-border-strong',
            'px-[18px] py-3.5 rounded-[14px]',
            'text-bodyMd text-ink-primary font-sans resize-y',
            'transition-colors duration-200',
            'focus:border-ink-primary focus:outline-none',
            'placeholder:text-ink-tertiary',
            className,
          )}
          {...props}
        />
        {hint && <span className="text-caption text-ink-tertiary">{hint}</span>}
      </div>
    )
  },
)
