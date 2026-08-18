'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Zap, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/app-data'
import { ProgressBar } from '@/components/progress-bar'
import { useDashboard } from '@/components/dashboard-provider'
import {
  habitWeek,
  habitStreak,
} from '@/lib/habit-utils'

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { habits, isLoadingHabits } = useDashboard()

  const activeHabits = habits.filter((h) => h.is_active)
  const weeklyDone = activeHabits.filter((h) => {
    const week = habitWeek(h)
    return week.some(Boolean)
  }).length
  const totalWeekly = activeHabits.length
  const weeklyPct = totalWeekly > 0 ? Math.round((weeklyDone / totalWeekly) * 100) : 0
  const totalStreak = activeHabits.reduce((s, h) => s + habitStreak(h), 0)

  return (
    <>
      {open && (
        <button
          aria-label="Cerrar navegación"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-5 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:overflow-y-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Zap className="size-5" fill="currentColor" />
            </div>
            <div>
              <p className="font-display text-lg font-extrabold leading-none tracking-tight">
                Momentum
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Mantén el flujo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar navegación"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menú
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'size-[18px] transition-transform group-hover:scale-110',
                    isActive ? '' : 'text-muted-foreground',
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue p-4 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <p className="text-sm font-semibold">Racha semanal</p>
            </div>
            <p className="mt-2 text-3xl font-extrabold">
              {isLoadingHabits ? '—' : `${weeklyDone}/${totalWeekly}`}
            </p>
            <p className="text-xs text-white/80">
              {totalWeekly === 0
                ? 'Agregá hábitos para empezar.'
                : totalStreak > 0
                  ? `${totalStreak} días de racha total. ¡Seguí así!`
                  : '¡Empezá tu primera racha hoy!'}
            </p>
            <div className="mt-3">
              <ProgressBar
                value={weeklyPct}
                accent="green"
                trackClassName="bg-white/25"
                className="bg-white"
                animate={false}
              />
            </div>
          </div>
          <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/10" />
        </div>
      </aside>
    </>
  )
}
