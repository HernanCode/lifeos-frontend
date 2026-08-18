'use client'

import { useMemo, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { ProgressBar } from '@/components/progress-bar'
import { TaskBoard } from '@/components/task-board'
import { useDashboard } from '@/components/dashboard-provider'
import { Skeleton } from '@/components/ui/skeleton'

export function TasksView() {
  const { tasks, isLoadingTasks, toggleTask, deleteTask, updateTask, projects } = useDashboard()
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('all')

  const filteredTasks = useMemo(() => {
    let result = tasks
    if (projectFilter === 'none') {
      result = result.filter((t) => !t.project_id)
    } else if (projectFilter !== 'all') {
      result = result.filter((t) => t.project_id === Number(projectFilter))
    }
    return result
  }, [tasks, projectFilter])

  const done = tasks.filter((t) => t.status === 'done')
  const active = tasks.filter((t) => t.status !== 'done')
  const pct = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0

  if (isLoadingTasks) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">
              Tareas
            </h1>
            <p className="mt-1 text-muted-foreground">
              Todo lo que tienes entre manos hoy, organizado y listo.
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded bg-muted" />
            <Skeleton className="h-4 w-10 rounded bg-muted" />
          </div>
          <Skeleton className="mt-3 h-2 w-full rounded-full bg-muted" />
        </div>
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Tareas
          </h1>
          <p className="mt-1 text-muted-foreground">
            Todo lo que tienes entre manos hoy, organizado y listo.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Progreso de hoy</p>
          <p className="text-sm font-semibold text-brand-purple">{pct}%</p>
        </div>
        <div className="mt-3">
          <ProgressBar value={pct} accent="purple" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {done.length} completadas · {active.length} restantes
        </p>
      </div>

      <TaskBoard
        tasks={filteredTasks}
        isLoading={false}
        search={search}
        onSearchChange={setSearch}
        onToggleTask={toggleTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        emptyIcon={ClipboardList}
        emptyTitle="No hay tareas aún"
        emptyDescription="Creá tu primera tarea para empezar a organizar tu día y mantener el impísin."
        emptyActionLabel="Crear mi primera tarea"
        extraFilters={
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
          >
            <option value="all">Todos los proyectos</option>
            <option value="none">Sin proyecto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        }
      />
    </div>
  )
}
