import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-bg-subtle rounded-lg animate-pulse',
        className,
      )}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-bg-surface rounded-xl border border-border-subtle p-5 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' }
  return <Skeleton className={cn('rounded-full', sizeMap[size])} />
}
