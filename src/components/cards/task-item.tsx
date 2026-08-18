'use client'

import { useState } from 'react'
import { Check, Clock, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCENT_CLASSES, type Accent } from '@/lib/app-data'
import type { Task } from '@/types'
import { Button } from '@/components/ui/button'

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
}: {
  task: Task
  onToggle: (id: number) => void
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onDragStart?: (e: React.DragEvent, task: Task) => void
}) {
  const done = task.status === 'done'
  const accent = ACCENT_CLASSES[taskAccent(task)]
  const [dragging, setDragging] = useState(false)

  return (
    <div
      draggable
      onDragStart={(e) => {
        setDragging(true)
        e.dataTransfer.effectAllowed = 'move'
        onDragStart?.(e, task)
      }}
      onDragEnd={() => setDragging(false)}
      className={cn(
        'group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-all',
        done && 'opacity-70',
        dragging && 'opacity-40 scale-[0.98] shadow-none',
        !dragging && 'hover:shadow-md hover:shadow-foreground/5',
      )}
    >
      <div className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-muted hover:text-muted-foreground active:cursor-grabbing">
        <GripVertical className="size-4" />
      </div>

      <button
        onClick={() => onToggle(task.id)}
        aria-pressed={done}
        aria-label={done ? 'Marcar tarea incompleta' : 'Marcar tarea completa'}
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all',
          done
            ? cn(accent.bar, 'border-transparent text-white')
            : 'border-border text-transparent hover:border-foreground/30',
        )}
      >
        <Check className="size-4" strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm font-medium',
            done && 'text-muted-foreground line-through',
          )}
        >
          {task.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {taskTime(task)}
        </div>
      </div>

      {task.project ? (
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: task.project.color ?? '#6b7280' }}
        >
          {taskTag(task)}
        </span>
      ) : (
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
            accent.soft,
            accent.text,
          )}
        >
          {taskTag(task)}
        </span>
      )}

      {onEdit && onDelete && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Editar tarea"
            onClick={() => onEdit(task)}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Eliminar tarea"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(task)}
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  )
}

function taskAccent(task: Task): Accent {
  if (task.is_urgent && task.is_important) return 'pink'
  if (task.is_important) return 'purple'
  if (task.is_urgent) return 'orange'
  return 'blue'
}

function taskTag(task: Task): string {
  if (task.project) return task.project.name
  if (task.goal) return task.goal.title
  if (task.is_urgent && task.is_important) return 'Prioritaria'
  if (task.is_urgent) return 'Urgente'
  if (task.is_important) return 'Importante'
  return 'Tarea'
}

function taskTime(task: Task): string {
  if (task.due_date) {
    return new Date(`${task.due_date}T00:00:00`).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    })
  }
  return new Date(task.created_at).toLocaleTimeString('es-ES', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
