'use client'

import Image from 'next/image'
import { CheckCircle2, ClipboardList, Flame, Target, TrendingUp } from 'lucide-react'
import type { Goal, Habit, Task } from '@/types'
import { habitStreak, habitWeek } from '@/lib/habit-utils'
import { firstName, greeting, useCurrentUser } from '@/lib/user-utils'
import { StatCard } from '@/components/cards/stat-card'
import { TaskItem } from '@/components/cards/task-item'
import { GoalCard } from '@/components/cards/goal-card'
import { HabitCard } from '@/components/cards/habit-card'
import { AIRecommendation } from '@/components/cards/ai-recommendation'
import { DashboardViewSkeleton } from '@/components/ui/skeleton'

export function DashboardView({
  tasks,
  goals,
  habits,
  isLoading,
  onToggleTask,
  onToggleHabitDay,
}: {
  tasks: Task[]
  goals: Goal[]
  habits: Habit[]
  isLoading: boolean
  onToggleTask: (id: number) => void
  onToggleHabitDay: (id: number, dayIndex: number) => void
}) {
  const user = useCurrentUser()

  if (isLoading) return <DashboardViewSkeleton />

  const doneTasks = tasks.filter((t) => t.status === 'done').length
  const taskPct = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0

  const activeHabits = habits.filter((h) => h.is_active)
  const habitsDoneToday = activeHabits.filter((h) => habitWeek(h)[6]).length
  const habitPct = activeHabits.length
    ? Math.round((habitsDoneToday / activeHabits.length) * 100)
    : 0

  const completedGoals = goals.filter((g) => g.status === 'completed').length
  const avgGoal = goals.length
    ? Math.round((completedGoals / goals.length) * 100)
    : 0

  let bestStreak = 0
  let bestHabitTitle = 'Sin hábitos aún'
  for (const h of activeHabits) {
    const s = habitStreak(h)
    if (s > bestStreak) {
      bestStreak = s
      bestHabitTitle = h.title
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="relative animate-rise-in overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold text-brand-purple">
            {user ? `${greeting()}, ${firstName(user.name)} 👋` : 'Bienvenido de vuelta 👋'}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
            Tú puedes con esto. Te quedan {tasks.length - doneTasks} tareas para un día perfecto.
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Pequeños pasos todos los días suman grandes victorias. Ya llevas el{' '}
            <span className="font-semibold text-foreground">{taskPct}%</span>{' '}
            del plan de hoy — ¡sigue con el impísin!
          </p>
        </div>
        <Image
          src="/illustrations/celebrate.png"
          alt=""
          aria-hidden="true"
          width={280}
          height={280}
          className="pointer-events-none absolute -right-6 -top-4 hidden w-56 opacity-90 md:block lg:w-64"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tareas completadas hoy"
          value={`${doneTasks}/${tasks.length}`}
          sub={`${taskPct}% del plan de hoy`}
          progress={taskPct}
          accent="purple"
          icon={CheckCircle2}
          delta="12%"
        />
        <StatCard
          label="Metas en progreso"
          value={`${avgGoal}%`}
          sub="Promedio de todas las metas"
          progress={avgGoal}
          accent="blue"
          icon={Target}
          delta="8%"
        />
        <StatCard
          label="Hábitos hechos hoy"
          value={`${habitsDoneToday}/${activeHabits.length}`}
          sub={`${habitPct}% de hábitos diarios`}
          progress={habitPct}
          accent="green"
          icon={TrendingUp}
          delta="5%"
        />
        <StatCard
          label="Mejor racha"
          value={`${bestStreak} días`}
          sub={bestHabitTitle}
          progress={Math.min(100, bestStreak * 4)}
          accent="orange"
          icon={Flame}
          delta="3 días"
        />
      </section>

      <AIRecommendation />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Tareas de hoy</h2>
            {tasks.length > 0 && (
              <span className="text-sm font-medium text-muted-foreground">
                {doneTasks} de {tasks.length} hechas
              </span>
            )}
          </div>
          <div className="mt-4">
            {tasks.length === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-5 text-muted-foreground">
                <ClipboardList className="size-5 shrink-0" />
                <p className="text-sm">No hay tareas. Creá una para empezar tu día.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={onToggleTask} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Metas</h2>
            {goals.length > 0 && (
              <span className="text-sm font-medium text-muted-foreground">
                {goals.length} en total
              </span>
            )}
          </div>
          <div className="mt-4">
            {goals.length === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-5 text-muted-foreground">
                <Target className="size-5 shrink-0" />
                <p className="text-sm">No hay metas. Definí una para empezar a crecer.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {goals.slice(0, 2).map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Seguimiento de hábitos</h2>
          {activeHabits.length > 0 && (
            <span className="text-sm font-medium text-muted-foreground">
              {habitsDoneToday} de {activeHabits.length} hoy
            </span>
          )}
        </div>
        <div className="mt-4">
          {activeHabits.length === 0 ? (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-5 text-muted-foreground">
              <Flame className="size-5 shrink-0" />
              <p className="text-sm">No hay hábitos. Creá uno para construir tu rutina ideal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggleDay={onToggleHabitDay}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
