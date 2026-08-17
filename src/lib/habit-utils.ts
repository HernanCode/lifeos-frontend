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
  let streak = 0
  for (let i = 0; i < 365; i++) {
    if (completedOn(habit, dateDaysAgo(i))) streak++
    else break
  }
  return streak
}

export function habitAccent(habit: Habit): Accent {
  return ACCENTS[habit.id % ACCENTS.length]
}

export function habitIcon(habit: Habit): LucideIcon {
  return ICONS[habit.id % ICONS.length]
}
