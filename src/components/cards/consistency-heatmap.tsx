'use client'

import { useMemo } from 'react'
import type { Accent } from '@/lib/app-data'
import { habitAccent, isHabitDoneOn, toDateString } from '@/lib/habit-utils'
import type { Habit } from '@/types'

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

const ACCENT_VAR: Record<Accent, string> = {
  blue: 'var(--brand-blue)',
  purple: 'var(--brand-purple)',
  green: 'var(--brand-green)',
  orange: 'var(--brand-orange)',
  pink: 'var(--brand-pink)',
}

function buildWeeks(count: number): Date[][] {
  const today = new Date()
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()))
  const start = new Date(endOfWeek)
  start.setDate(endOfWeek.getDate() - (count * 7 - 1))

  const weeks: Date[][] = []
  for (let w = 0; w < count; w++) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      week.push(date)
    }
    weeks.push(week)
  }
  return weeks
}

export function ConsistencyHeatmap({
  habit,
  weeks = 12,
  showLabels = false,
  showLegend = false,
}: {
  habit: Habit
  weeks?: number
  showLabels?: boolean
  showLegend?: boolean
}) {
  const grid = useMemo(() => buildWeeks(weeks), [weeks])
  const today = toDateString(new Date())
  const accent: Accent = habitAccent(habit)
  const baseColor = ACCENT_VAR[accent]

  const labelFor = useMemo(() => {
    if (!showLabels) return new Map<number, string>()
    const labels = new Map<number, string>()
    let prevMonth = -1
    grid.forEach((week, i) => {
      const month = week[0].getMonth()
      if (i > 0 && month !== prevMonth && week[0].getDate() <= 7) {
        labels.set(i, MONTHS[month])
      }
      prevMonth = month
    })
    return labels
  }, [grid, showLabels])

  function cellInfo(date: Date): { done: boolean; isFuture: boolean } {
    const dateStr = toDateString(date)
    if (dateStr > today) return { done: false, isFuture: true }
    return { done: isHabitDoneOn(habit, dateStr), isFuture: false }
  }

  const dayLabels = WEEKDAY_LABELS.map((label, d) => (d % 2 === 1 ? label : ''))

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max">
          <div className="grid grid-rows-7 gap-[3px] pr-1.5">
            {dayLabels.map((label, d) => (
              <div
                key={d}
                className="flex h-2.5 items-center text-[8px] leading-none text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {showLabels && (
              <div className="flex h-2.5 gap-[3px]">
                {grid.map((_, i) => (
                  <div key={i} className="relative w-2.5">
                    {labelFor.get(i) && (
                      <span className="absolute left-0 top-0 text-[8px] leading-none text-muted-foreground">
                        {labelFor.get(i)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {grid.flat().map((date) => {
                const { done, isFuture } = cellInfo(date)
                return (
                  <div
                    key={date.toISOString()}
                    title={
                      isFuture
                        ? undefined
                        : `${done ? 'Completado' : 'No completado'} el ${toDateString(date)}`
                    }
                    className="size-2.5 rounded-[3px] transition-transform hover:scale-125"
                    style={{
                      backgroundColor: isFuture
                        ? 'transparent'
                        : done
                          ? baseColor
                          : 'var(--muted)',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {showLegend && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Últimas {weeks} semanas</span>
          <div className="flex items-center gap-1.5">
            <span>Menos</span>
            <span className="size-2.5 rounded-[3px]" style={{ backgroundColor: 'var(--muted)' }} />
            <span className="size-2.5 rounded-[3px]" style={{ backgroundColor: baseColor }} />
            <span>Más</span>
          </div>
        </div>
      )}
    </div>
  )
}
