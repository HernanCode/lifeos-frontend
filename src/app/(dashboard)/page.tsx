'use client'

import { useDashboard } from '@/components/dashboard-provider'
import { DashboardView } from '@/components/views/dashboard-view'

export default function DashboardPage() {
  const { tasks, goals, habits, isLoadingTasks, isLoadingGoals, isLoadingHabits, toggleTask, toggleHabitDay } = useDashboard()

  const isLoading = isLoadingTasks || isLoadingGoals || isLoadingHabits

  return (
    <DashboardView
      tasks={tasks}
      goals={goals}
      habits={habits}
      isLoading={isLoading}
      onToggleTask={toggleTask}
      onToggleHabitDay={toggleHabitDay}
    />
  )
}
