import { cn } from '@/lib/utils'
import { ACCENT_CLASSES, type Accent } from '@/lib/app-data'

export function ProgressBar({
  value,
  accent = 'purple',
  className,
  trackClassName,
  animate = true,
}: {
  value: number
  accent?: Accent
  className?: string
  trackClassName?: string
  animate?: boolean
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'h-2.5 w-full overflow-hidden rounded-full bg-muted',
        trackClassName,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full',
          ACCENT_CLASSES[accent].bar,
          animate && 'animate-grow-width',
          className,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
