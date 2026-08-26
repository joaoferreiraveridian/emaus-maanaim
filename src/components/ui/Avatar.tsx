import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  name: string
  size?: AvatarSize
  className?: string
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-caption',
  md: 'w-10 h-10 text-bodySm',
  lg: 'w-14 h-14 text-bodyLg',
  xl: 'w-20 h-20 text-headingMd',
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover border-2 border-border-subtle',
          sizeStyles[size],
          className,
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center',
        'bg-bg-subtle border-2 border-border-subtle',
        'font-medium text-ink-secondary select-none',
        sizeStyles[size],
        className,
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
