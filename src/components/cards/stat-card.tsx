import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCENT_CLASSES, type Accent } from '@/lib/app-data'
import { ProgressBar } from '@/components/progress-bar'

export function StatCard({
  label,
  value,
  sub,
  progress,
  accent,
  icon: Icon,
  delta,
}: {
  label: string
  value: string
  sub: string
  progress: number
  accent: Accent
  icon: LucideIcon
  delta?: string
}) {
  const a = ACCENT_CLASSES[accent]
  return (
    <div className="rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'flex size-11 items-center justify-center rounded-2xl',
            a.soft,
            a.text,
          )}
        >
          <Icon className="size-5" />
        </div>
        {delta && (
          <span
            className={cn(
              'flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold',
              a.soft,
              a.text,
            )}
          >
            <ArrowUpRight className="size-3" />
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-4">
        <ProgressBar value={progress} accent={accent} />
        <p className="mt-2 text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  )
}
