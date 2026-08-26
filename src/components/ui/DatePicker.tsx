import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  label?: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toISODate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseISODate(value?: string) {
  if (!value) return null
  const partes = value.split('-').map(Number)
  return new Date(partes[0] ?? 0, (partes[1] ?? 1) - 1, partes[2] ?? 1)
}

function isMesmoDia(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function gerarGrade(mesReferencia: Date) {
  const inicioMes = new Date(mesReferencia.getFullYear(), mesReferencia.getMonth(), 1)
  const inicioGrade = new Date(inicioMes)
  inicioGrade.setDate(inicioGrade.getDate() - inicioMes.getDay())

  return Array.from({ length: 42 }, (_, i) => {
    const dia = new Date(inicioGrade)
    dia.setDate(dia.getDate() + i)
    return dia
  })
}

export function DatePicker({ label, value, onChange, placeholder = 'dd/mm/aaaa', className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selecionado = parseISODate(value)
  const [mesReferencia, setMesReferencia] = useState(() => selecionado ?? new Date())
  const rootRef = useRef<HTMLDivElement>(null)
  const hoje = new Date()

  useEffect(() => {
    if (open) setMesReferencia(selecionado ?? new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
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

  const rotuloMes = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(mesReferencia)

  return (
    <div className={cn('flex flex-col gap-1.5', className)} ref={rootRef}>
      {label && (
        <span className="text-label font-medium text-ink-secondary tracking-wide">{label}</span>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            'w-full flex items-center justify-between gap-2 cursor-pointer',
            'bg-bg-surface border border-border-strong',
            'px-[18px] py-3.5 rounded-[14px]',
            'text-bodyMd font-sans text-left',
            selecionado ? 'text-ink-primary' : 'text-ink-tertiary',
            'transition-colors duration-200',
            open && 'border-ink-primary',
          )}
        >
          {selecionado ? toISODate(selecionado).split('-').reverse().join('/') : placeholder}
          <CalendarBlank size={18} className="text-ink-tertiary shrink-0" />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 mt-1.5 w-72 bg-bg-surface border border-border-subtle rounded-[14px] shadow-elevated p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-bodyMd font-medium text-ink-primary capitalize">{rotuloMes}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setMesReferencia((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                    className="p-1.5 rounded-full hover:bg-bg-subtle transition-colors cursor-pointer"
                  >
                    <CaretLeft size={16} className="text-ink-secondary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMesReferencia((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                    className="p-1.5 rounded-full hover:bg-bg-subtle transition-colors cursor-pointer"
                  >
                    <CaretRight size={16} className="text-ink-secondary" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {DIAS_SEMANA.map((d, i) => (
                  <span key={i} className="text-caption text-ink-tertiary font-medium py-1">
                    {d}
                  </span>
                ))}
                {gerarGrade(mesReferencia).map((dia) => {
                  const foraDoMes = dia.getMonth() !== mesReferencia.getMonth()
                  const ativo = !!selecionado && isMesmoDia(dia, selecionado)
                  const ehHoje = isMesmoDia(dia, hoje)
                  return (
                    <button
                      key={dia.toISOString()}
                      type="button"
                      onClick={() => {
                        onChange(toISODate(dia))
                        setOpen(false)
                      }}
                      className={cn(
                        'w-9 h-9 mx-auto rounded-full text-bodySm transition-colors duration-150 cursor-pointer',
                        ativo
                          ? 'bg-accent-primary text-white font-medium'
                          : foraDoMes
                            ? 'text-ink-tertiary hover:bg-bg-subtle'
                            : 'text-ink-primary hover:bg-bg-subtle',
                        !ativo && ehHoje && 'ring-1 ring-inset ring-accent-primary',
                      )}
                    >
                      {dia.getDate()}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => {
                    onChange('')
                    setOpen(false)
                  }}
                  className="text-bodySm text-accent-primary hover:opacity-80 cursor-pointer"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(toISODate(hoje))
                    setOpen(false)
                  }}
                  className="text-bodySm text-accent-primary hover:opacity-80 cursor-pointer"
                >
                  Hoje
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
