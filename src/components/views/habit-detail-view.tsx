'use client'

import { useMemo, useState } from 'react'
import { createElement } from 'react'
import {
  ArrowLeft,
  Flame,
  Calendar,
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCENT_CLASSES } from '@/lib/app-data'
import type { Habit } from '@/types'
import {
  habitAccent,
  habitCompletionRate,
  habitDaysSinceCreated,
  habitFrequencyLabel,
  habitIcon,
  habitMonthData,
  habitStreakLabel,
  habitTotalCompletions,
  habitWeek,
  habitWeekCompletedCount,
} from '@/lib/habit-utils'
import { Button } from '@/components/ui/button'
import { ConsistencyHeatmap } from '@/components/cards/consistency-heatmap'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function toKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function HabitDetailView({
  habit,
  onToggleDate,
  onBack,
}: {
  habit: Habit
  onToggleDate: (id: number, date: string) => void
  onBack: () => void
}) {
  const accent = ACCENT_CLASSES[habitAccent(habit)]
  const icon = habitIcon(habit)
  const week = habitWeek(habit)
  const doneToday = week[6]
  const isWeekly = habit.frequency === 'weekly'
  const weekCount = isWeekly ? habitWeekCompletedCount(habit) : 0
  const weekTarget = habit.target_count
  const weekPct = isWeekly ? Math.min(100, Math.round((weekCount / weekTarget) * 100)) : 0

  const todayKey = new Date().toISOString().split('T')[0]

  const [calYear, calMonth] = useMemo(() => {
    const now = new Date()
    return [now.getFullYear(), now.getMonth()]
  }, [])

  const [viewYear, setViewYear] = useState(calYear)
  const [viewMonth, setViewMonth] = useState(calMonth)

  const monthData = useMemo(
    () => habitMonthData(habit, viewYear, viewMonth),
    [habit, viewYear, viewMonth],
  )

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)
  const monthDone = useMemo(
    () => Array.from(monthData.values()).filter(Boolean).length,
    [monthData],
  )

  const stats = [
    {
      icon: Flame,
      label: 'Racha actual',
      value: habitStreakLabel(habit),
      accent: 'text-brand-orange',
    },
    {
      icon: TrendingUp,
      label: 'Total hechos',
      value: habitTotalCompletions(habit),
      accent: accent.text,
    },
    {
      icon: Activity,
      label: 'Tasa de éxito',
      value: `${habitCompletionRate(habit)}%`,
      accent: 'text-brand-green',
    },
    {
      icon: Calendar,
      label: 'Días activos',
      value: habitDaysSinceCreated(habit),
      accent: 'text-muted-foreground',
    },
  ]

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  return (
    <div className="space-y-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Volver a hábitos">
          <ArrowLeft />
        </Button>
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl',
            accent.soft,
            accent.text,
          )}
        >
          {createElement(icon, { className: 'size-5' })}
        </div>
        <div>
          <h1 className="text-lg font-bold">{habit.title}</h1>
          <p className="text-xs text-muted-foreground">
            {habitFrequencyLabel(habit)}
          </p>
        </div>
      </div>

      {/* Top row: Today toggle + Stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Today toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 lg:col-span-1">
          <div>
            <p className="text-sm font-medium">Hoy</p>
            <p className="text-xs text-muted-foreground">
              {doneToday ? 'Ya lo hiciste hoy' : '¿Lo hiciste hoy?'}
            </p>
          </div>
          <button
            onClick={() => onToggleDate(habit.id, todayKey)}
            className={cn(
              'rounded-xl px-4 py-1.5 text-sm font-bold transition-all',
              doneToday
                ? cn(accent.solid, 'shadow-sm')
                : 'border border-border text-muted-foreground hover:border-foreground/30',
            )}
          >
            {doneToday ? 'Hecho ✓' : 'Marcar'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <s.icon className={cn('size-4 shrink-0', s.accent)} />
              <div>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="text-sm font-bold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content: Calendar + Weekly grid side by side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Month calendar - wider */}
        <div className="rounded-2xl border border-border bg-card p-4 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <Button variant="ghost" size="icon-sm" onClick={prevMonth} aria-label="Mes anterior">
              <ChevronLeft />
            </Button>
            <p className="text-sm font-medium">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </p>
            <Button variant="ghost" size="icon-sm" onClick={nextMonth} aria-label="Mes siguiente">
              <ChevronRight />
            </Button>
          </div>

          {/* Weekday headers */}
          <div className="mb-1 grid grid-cols-7">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="py-1 text-center text-[10px] font-medium text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid - small circles */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="py-1" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const key = toKey(viewYear, viewMonth, day)
              const done = monthData.get(key) ?? false
              const isToday = key === todayKey
              const isFuture = key > todayKey
              return (
                <div key={day} className="flex justify-center py-[3px]">
                  <button
                    onClick={() => !isFuture && onToggleDate(habit.id, key)}
                    disabled={isFuture}
                    aria-label={`${day} de ${MONTH_NAMES[viewMonth]} ${done ? 'completado' : isFuture ? 'futuro' : 'no completado'}`}
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full text-[11px] font-medium transition-all',
                      done && cn(accent.bar, 'text-white shadow-sm'),
                      !done && !isFuture && 'text-muted-foreground hover:bg-muted',
                      !done && isFuture && 'text-muted-foreground/40 cursor-not-allowed',
                      isToday && !done && 'ring-2 ring-foreground/20',
                      isToday && done && 'ring-2 ring-foreground/30',
                    )}
                  >
                    {day}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{monthDone} de {daysInMonth} días</span>
            <span>{daysInMonth > 0 ? Math.round((monthDone / daysInMonth) * 100) : 0}%</span>
          </div>
        </div>

        {/* Weekly grid - narrower */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-sm font-medium">Esta semana</p>
            {isWeekly && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progreso</span>
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
            <div className="flex items-center justify-between gap-1">
              {week.map((done, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const d = new Date()
                    d.setDate(d.getDate() - (6 - i))
                    onToggleDate(habit.id, d.toISOString().split('T')[0])
                  }}
                  aria-label={`${WEEKDAY_LABELS[i]} ${done ? 'completado' : 'no completado'}`}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <span className="text-[10px] text-muted-foreground">
                    {WEEKDAY_LABELS[i]}
                  </span>
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full text-[11px] font-bold transition-all',
                      done
                        ? cn(accent.bar, 'text-white shadow-sm')
                        : 'bg-muted text-muted-foreground hover:bg-accent',
                    )}
                  >
                    {done ? '✓' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-sm font-medium">Historial</p>
            <ConsistencyHeatmap habit={habit} weeks={12} showLabels={false} showLegend />
          </div>
        </div>
      </div>
    </div>
  )
}
