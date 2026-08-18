import type { ElementType } from 'react'
import { Button } from '@/components/ui/button'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
}: {
  icon: ElementType
  title: string
  description: string
  action?: boolean
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-display text-lg font-extrabold tracking-tight">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && actionLabel && onAction && (
        <Button className="mt-5 h-10 rounded-xl px-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
