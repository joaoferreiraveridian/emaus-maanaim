import { type ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-ink-primary/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'relative z-10 w-full bg-bg-surface rounded-t-3xl',
              'max-h-[85vh] overflow-y-auto',
              'shadow-elevated',
              className,
            )}
          >
            <div className="sticky top-0 bg-bg-surface pt-3 pb-4 px-6 z-10">
              <div className="w-10 h-1 bg-border-default rounded-full mx-auto mb-4" />
              {title && (
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-displayMd">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-bg-subtle transition-colors"
                  >
                    <X size={20} className="text-ink-secondary" />
                  </button>
                </div>
              )}
            </div>
            <div className="px-6 pb-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
