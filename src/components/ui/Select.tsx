import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CaretDown, Check } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
}

export function Select({ label, value, onChange, options, className }: SelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className={cn('flex flex-col gap-1.5', className)} ref={rootRef}>
      {label && (
        <span className="text-label font-medium text-ink-secondary tracking-wide">{label}</span>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            'w-full flex items-center justify-between gap-2 cursor-pointer',
            'bg-bg-surface border border-border-strong',
            'px-[18px] py-3.5 rounded-[14px]',
            'text-bodyMd text-ink-primary font-sans text-left',
            'transition-colors duration-200',
            open && 'border-ink-primary',
          )}
        >
          {selected?.label ?? ''}
          <CaretDown
            size={16}
            className={cn(
              'text-ink-tertiary shrink-0 transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        </button>
        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 mt-1.5 w-full max-h-64 overflow-auto bg-bg-surface border border-border-subtle rounded-[14px] shadow-elevated p-1.5"
            >
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 cursor-pointer',
                      'px-3.5 py-2.5 rounded-[10px] text-bodyMd text-left transition-colors duration-150',
                      option.value === value
                        ? 'bg-ink-primary text-white'
                        : 'text-ink-primary hover:bg-bg-subtle',
                    )}
                  >
                    {option.label}
                    {option.value === value && <Check size={16} weight="bold" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
