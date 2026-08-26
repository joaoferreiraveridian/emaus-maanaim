import { cn } from '@/lib/utils'

interface ToggleProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  hint?: string
}

/** Sim/Não em duas pastilhas — mais rápido no celular que um checkbox. */
export function Toggle({ label, value, onChange, hint }: ToggleProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-label font-medium text-ink-secondary tracking-wide">
        {label}
      </span>
      <div className="flex gap-2">
        {[true, false].map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={cn(
              'flex-1 py-3 rounded-[14px] text-bodyMd font-medium border transition-colors duration-200',
              value === option
                ? 'bg-ink-primary text-white border-ink-primary'
                : 'bg-bg-surface text-ink-secondary border-border-strong',
            )}
          >
            {option ? 'Sim' : 'Não'}
          </button>
        ))}
      </div>
      {hint && <span className="text-caption text-ink-tertiary">{hint}</span>}
    </div>
  )
}
