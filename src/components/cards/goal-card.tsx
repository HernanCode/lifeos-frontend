'use client'

import { CalendarDays, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCENT_CLASSES, type Accent } from '@/lib/app-data'
import type { Goal } from '@/types'
import { Button } from '@/components/ui/button'

const STATUS_META: Record<Goal['status'], { label: string; accent: Accent }> = {
  active: { label: 'Activa', accent: 'purple' },
  completed: { label: 'Completada', accent: 'green' },
  abandoned: { label: 'Abandonada', accent: 'pink' },
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
}: {
  goal: Goal
  onEdit?: (goal: Goal) => void
  onDelete?: (goal: Goal) => void
}) {
  const meta = STATUS_META[goal.status]
  const accent = ACCENT_CLASSES[meta.accent]
  const category = goal.life_area?.name ?? 'Meta'
  const due = goal.deadline
    ? new Date(`${goal.deadline}T00:00:00`).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
      })
    : '—'

  return (
    <div className="group rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={cn(
              'inline-block rounded-full px-2.5 py-1 text-xs font-semibold',
              accent.soft,
              accent.text,
            )}
          >
            {category}
          </span>
          <h3 className="mt-2 text-base font-bold text-balance">{goal.title}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-semibold',
              accent.soft,
              accent.text,
            )}
          >
            {meta.label}
          </span>
          {onEdit && onDelete && (
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Editar meta"
                onClick={() => onEdit(goal)}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Eliminar meta"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(goal)}
              >
                <Trash2 />
              </Button>
            </div>
          )}
        </div>
      </div>

      {goal.measurable && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {goal.measurable}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          Límite {due}
        </span>
      </div>
    </div>
  )
}
