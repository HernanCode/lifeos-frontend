'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus, Pencil, Trash2, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'
import { Button } from '@/components/ui/button'
import { TaskBoard } from '@/components/task-board'
import { useDashboard } from '@/components/dashboard-provider'
import { taskService } from '@/lib/services/taskService'
import { ProjectModal } from '@/components/modals/project-modal'

const STATUS_META: Record<Project['status'], { label: string; dot: string }> = {
  active: { label: 'Activo', dot: 'bg-green-500' },
  paused: { label: 'Pausado', dot: 'bg-yellow-500' },
  completed: { label: 'Completado', dot: 'bg-blue-500' },
  archived: { label: 'Archivado', dot: 'bg-muted-foreground' },
}

export function ProjectDetailView({
  project,
  onBack,
}: {
  project: Project
  onBack: () => void
}) {
  const { toggleTask, deleteTask, deleteProject, updateTask } = useDashboard()
  const color = project.color || '#6b7280'
  const meta = STATUS_META[project.status]

  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: projectTasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', 'project', project.id],
    queryFn: () => taskService.getAll({ project_id: project.id }),
  })

  const doneCount = projectTasks.filter((t) => t.status === 'done').length
  const completionPct = projectTasks.length
    ? Math.round((doneCount / projectTasks.length) * 100)
    : 0

  const due = project.due_date
    ? new Date(`${project.due_date}T00:00:00`).toLocaleDateString('es-ES', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="space-y-5 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Volver a proyectos">
            <ArrowLeft />
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <h1 className="text-lg font-bold">{project.name}</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
                <span className={cn('size-1.5 rounded-full', meta.dot)} />
                {meta.label}
              </span>
            </div>
            {project.description && (
              <p className="mt-1 ml-5.5 text-sm text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Editar proyecto" onClick={() => setProjectModalOpen(true)}>
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Eliminar proyecto"
            className="text-destructive hover:text-destructive"
            onClick={() => deleteProject(project.id).then(onBack)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
            <span className="text-sm font-bold">{projectTasks.length}</span>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Tareas</p>
            <p className="text-sm font-semibold">{projectTasks.length === 1 ? '1 tarea' : `${projectTasks.length} tareas`}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
            <span className="text-sm font-bold">{completionPct}%</span>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Completado</p>
            <p className="text-sm font-semibold">{doneCount} de {projectTasks.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
            <CalendarDays className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Fecha límite</p>
            <p className="text-sm font-semibold">{due ?? 'Sin fecha'}</p>
          </div>
        </div>
      </div>

      {/* Task list header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold">Tareas del proyecto</h2>
      </div>

      <TaskBoard
        tasks={projectTasks}
        isLoading={isLoadingTasks}
        search={search}
        onSearchChange={setSearch}
        onToggleTask={toggleTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        defaultProjectId={project.id}
        emptyIcon={Plus}
        emptyTitle="No hay tareas aún"
        emptyDescription="Agrega tu primera tarea para este proyecto."
        emptyActionLabel="Crear primera tarea"
      />

      {projectModalOpen && (
        <ProjectModal
          project={project}
          onClose={() => setProjectModalOpen(false)}
        />
      )}
    </div>
  )
}
