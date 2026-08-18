import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Coffee,
  Droplet,
  Dumbbell,
  Footprints,
  HeartPulse,
  Moon,
  PenTool,
  Sparkles,
  Star,
} from 'lucide-react'
import type { Habit } from '@/types'
import type { Accent } from '@/lib/app-data'

const ACCENTS: Accent[] = ['purple', 'blue', 'green', 'orange', 'pink']
const ICONS: LucideIcon[] = [
  Droplet,
  Dumbbell,
  BookOpen,
  Sparkles,
  Moon,
  HeartPulse,
  Footprints,
  Coffee,
  PenTool,
  Star,
]

export function toDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function dateDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return toDateString(d)
}

function completedOn(habit: Habit, date: string): boolean {
  return habit.logs?.some((l) => l.date === date && l.completed) ?? false
}

export function isHabitDoneOn(habit: Habit, date: string): boolean {
  return completedOn(habit, date)
}

export function habitWeek(habit: Habit): boolean[] {
  return Array.from({ length: 7 }, (_, i) => completedOn(habit, dateDaysAgo(6 - i)))
}

export function habitStreak(habit: Habit): number {
  if (habit.frequency === 'weekly') return habitWeekStreak(habit)

  let streak = 0
  for (let i = 0; i < 365; i++) {
    if (completedOn(habit, dateDaysAgo(i))) streak++
    else break
  }
  return streak
}

function habitWeekStreak(habit: Habit): number {
  let streak = 0
  for (let w = 0; w < 52; w++) {
    const weekStart = w * 7
    let count = 0
    for (let d = 0; d < 7; d++) {
      if (completedOn(habit, dateDaysAgo(weekStart + d))) count++
    }
    if (count >= habit.target_count) streak++
    else break
  }
  return streak
}

export function habitWeekCompletedCount(habit: Habit): number {
  let count = 0
  for (let i = 0; i < 7; i++) {
    if (completedOn(habit, dateDaysAgo(i))) count++
  }
  return count
}

export function habitStreakLabel(habit: Habit): string {
  const streak = habitStreak(habit)
  if (habit.frequency === 'weekly') {
    return `${streak} ${streak === 1 ? 'semana' : 'semanas'} de racha`
  }
  return `${streak} días de racha`
}

export function habitFrequencyLabel(habit: Habit): string {
  switch (habit.frequency) {
    case 'daily':
      return habit.target_count > 1
        ? `${habit.target_count} veces al día`
        : 'Diario'
    case 'weekly':
      return `${habit.target_count} ${habit.target_count === 1 ? 'vez' : 'veces'} por semana`
    case 'custom':
      return 'Personalizado'
  }
}

export function habitAccent(habit: Habit): Accent {
  return ACCENTS[habit.id % ACCENTS.length]
}

export function habitIcon(habit: Habit): LucideIcon {
  return ICONS[habit.id % ICONS.length]
}

/** Total number of logs marked completed */
export function habitTotalCompletions(habit: Habit): number {
  return habit.logs?.filter((l) => l.completed).length ?? 0
}

/** Percentage of completed logs over total logs (0-100) */
export function habitCompletionRate(habit: Habit): number {
  const total = habit.logs?.length ?? 0
  if (total === 0) return 0
  const done = habit.logs!.filter((l) => l.completed).length
  return Math.round((done / total) * 100)
}

/** Returns a Map<dateString, completed> for every day in the given month */
export function habitMonthData(
  habit: Habit,
  year: number,
  month: number,
): Map<string, boolean> {
  const map = new Map<string, boolean>()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    map.set(key, completedOn(habit, key))
  }
  return map
}

/** Date when habit was created */
export function habitStartDate(habit: Habit): Date {
  return new Date(habit.created_at)
}

/** Number of days since habit was created */
export function habitDaysSinceCreated(habit: Habit): number {
  const start = habitStartDate(habit)
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
