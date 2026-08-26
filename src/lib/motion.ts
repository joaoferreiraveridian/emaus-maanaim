import type { Transition } from 'framer-motion'

export const easePremium: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const transitionSpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

export const transitionSmooth: Transition = {
  duration: 0.4,
  ease: easePremium,
}

export const fadeUpProps = {
  initial: { opacity: 0, y: 10 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.4, ease: easePremium },
}

export const scaleInProps = {
  initial: { opacity: 0, scale: 0.95 } as const,
  animate: { opacity: 1, scale: 1 } as const,
  transition: { duration: 0.25, ease: easePremium },
}

export const slideUpProps = {
  initial: { y: '100%' } as const,
  animate: { y: 0 } as const,
  exit: { y: '100%' } as const,
  transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
}

export function staggeredFadeUp(index: number) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: index * 0.06, ease: easePremium },
  }
}

export const tapScale = { whileTap: { scale: 0.96 } }
export const cardTap = { whileTap: { scale: 0.98 } }
