'use client'

import { createElement } from 'react'
import { Flame, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCENT_CLASSES } from '@/lib/app-data'
import type { Habit } from '@/types'
import {
  habitAccent,
  habitFrequencyLabel,
  habitIcon,
  habitStreakLabel,
  habitWeek,
  habitWeekCompletedCount,
} from '@/lib/habit-utils'
import { Button } from '@/components/ui/button'

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export function HabitCard({
  habit,
  onToggleDay,
  onEdit,
  onDelete,
  onClick,
}: {
  habit: Habit
  onToggleDay: (id: number, dayIndex: number) => void
  onEdit?: (habit: Habit) => void
  onDelete?: (habit: Habit) => void
  onClick?: (habit: Habit) => void
}) {
  const accent = ACCENT_CLASSES[habitAccent(habit)]
  const icon = habitIcon(habit)
  const week = habitWeek(habit)
  const doneToday = week[6]
  const isWeekly = habit.frequency === 'weekly'
  const weekCount = isWeekly ? habitWeekCompletedCount(habit) : 0
  const weekTarget = habit.target_count
  const weekPct = isWeekly ? Math.min(100, Math.round((weekCount / weekTarget) * 100)) : 0

  return (
    <div
      className={cn(
        'group rounded-3xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:shadow-foreground/5',
        onClick && 'cursor-pointer',
      )}
      onClick={onClick ? () => onClick(habit) : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-11 items-center justify-center rounded-2xl',
              accent.soft,
              accent.text,
            )}
          >
            {createElement(icon, { className: 'size-5' })}
          </div>
          <div>
            <p className="text-sm font-bold">{habit.title}</p>
            <p className="text-xs text-muted-foreground">
              {habitFrequencyLabel(habit)}
            </p>
            <p className="flex items-center gap-1 text-xs font-medium text-brand-orange">
              <Flame className="size-3.5" fill="currentColor" />
              {habitStreakLabel(habit)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleDay(habit.id, 6) }}
            aria-pressed={doneToday}
            aria-label={doneToday ? 'Deshacer hoy' : 'Marcar hecho hoy'}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
              doneToday
                ? cn(accent.solid, 'shadow-sm')
                : 'border border-border text-muted-foreground hover:border-foreground/30',
            )}
          >
            {doneToday ? 'Hecho' : 'Hoy'}
          </button>
          {onEdit && onDelete && (
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Editar hábito"
                onClick={(e) => { e.stopPropagation(); onEdit(habit) }}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Eliminar hábito"
                className="text-destructive hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(habit) }}
              >
                <Trash2 />
              </Button>
            </div>
          )}
        </div>
      </div>

      {isWeekly && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              esta semana
            </span>
            <span className={cn('font-semibold', accent.text)}>
              {weekCount}/{weekTarget}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full transition-all', accent.bar)}
              style={{ width: `${weekPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-1.5">
        {week.map((done, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onToggleDay(habit.id, i) }}
            aria-label={`${DAY_LABELS[i]} ${done ? 'completado' : 'no completado'}`}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                'flex aspect-square w-full max-w-9 items-center justify-center rounded-xl text-xs font-bold transition-all',
                done
                  ? cn(accent.bar, 'text-white')
                  : 'bg-muted text-muted-foreground hover:bg-accent',
              )}
            >
              {DAY_LABELS[i]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
