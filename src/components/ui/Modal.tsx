import { type ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { scaleInProps } from '@/lib/motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-ink-primary/40"
            onClick={onClose}
          />
          <motion.div
            {...scaleInProps}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className={cn(
              'relative z-10 w-full max-w-md bg-bg-surface rounded-2xl p-6',
              'shadow-elevated',
              className,
            )}
          >
            {title && (
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-displayMd">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-bg-subtle transition-colors"
                >
                  <X size={20} className="text-ink-secondary" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
