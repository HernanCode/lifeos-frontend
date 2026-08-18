'use client'

import { CalendarDays, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'
import { Button } from '@/components/ui/button'

const STATUS_META: Record<Project['status'], { label: string; dot: string }> = {
  active: { label: 'Activo', dot: 'bg-green-500' },
  paused: { label: 'Pausado', dot: 'bg-yellow-500' },
  completed: { label: 'Completado', dot: 'bg-blue-500' },
  archived: { label: 'Archivado', dot: 'bg-muted-foreground' },
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onClick,
}: {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (project: Project) => void
  onClick?: (project: Project) => void
}) {
  const meta = STATUS_META[project.status]
  const color = project.color || '#6b7280'
  const taskCount = project.tasks?.length ?? 0
  const due = project.due_date
    ? new Date(`${project.due_date}T00:00:00`).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div
      className="group rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5 cursor-pointer"
      onClick={() => onClick?.(project)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="size-3 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-base font-bold text-balance">{project.name}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold')}>
            <span className={cn('size-1.5 rounded-full', meta.dot)} />
            {meta.label}
          </span>
          {onEdit && onDelete && (
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Editar proyecto"
                onClick={(e) => { e.stopPropagation(); onEdit(project) }}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Eliminar proyecto"
                className="text-destructive hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(project) }}
              >
                <Trash2 />
              </Button>
            </div>
          )}
        </div>
      </div>

      {project.description && (
        <p className="mt-2.5 line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{taskCount} {taskCount === 1 ? 'tarea' : 'tareas'}</span>
        {due && (
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {due}
          </span>
        )}
      </div>
    </div>
  )
}
