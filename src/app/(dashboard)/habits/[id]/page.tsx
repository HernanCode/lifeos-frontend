'use client'

import { use, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { HabitDetailView } from '@/components/views/habit-detail-view'
import { useDashboard } from '@/components/dashboard-provider'
import { Skeleton } from '@/components/ui/skeleton'

function HabitDetailSkeleton() {
  return (
    <div className="space-y-5 py-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-20 rounded-2xl lg:col-span-1" />
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Skeleton className="h-64 rounded-2xl lg:col-span-3" />
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { habits, toggleHabitDate } = useDashboard()

  const habitId = Number(id)
  const habit = habits?.find((h) => h.id === habitId)

  if (!habit) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Hábito no encontrado
      </div>
    )
  }

  return (
    <Suspense fallback={<HabitDetailSkeleton />}>
      <HabitDetailView
        habit={habit}
        onToggleDate={toggleHabitDate}
        onBack={() => router.push('/habits')}
      />
    </Suspense>
  )
}
