'use client'

import { use, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboard } from '@/components/dashboard-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectDetailView } from '@/components/views/project-detail-view'

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-5 py-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { projects } = useDashboard()

  const projectId = Number(id)
  const project = projects?.find((p) => p.id === projectId)

  if (!project) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Proyecto no encontrado
      </div>
    )
  }

  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailView
        project={project}
        onBack={() => router.push('/projects')}
      />
    </Suspense>
  )
}
