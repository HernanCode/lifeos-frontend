'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Task } from '@/types'
import { Button } from '@/components/ui/button'
import { TaskItem } from '@/components/cards/task-item'
import { ProgressBar } from '@/components/progress-bar'
import { TaskModal } from '@/components/modals/task-modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useDashboard } from '@/components/dashboard-provider'
import { TaskItemSkeleton } from '@/components/ui/skeleton'

export function TasksView() {
  const { tasks, isLoadingTasks, toggleTask, deleteTask } = useDashboard()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  function openCreate() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setModalOpen(true)
  }

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
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-10 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-3 h-2 w-full animate-pulse rounded-full bg-muted" />
        </div>
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <TaskItemSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  const done = tasks.filter((t) => t.status === 'done')
  const active = tasks.filter((t) => t.status !== 'done')
  const pct = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0

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
        <Button size="lg" className="h-10 rounded-xl px-4" onClick={openCreate}>
          <Plus className="size-4" />
          Nueva tarea
        </Button>
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

      <section>
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Por hacer · {active.length}
        </h2>
        <div className="flex flex-col gap-2.5">
          {active.length ? (
            active.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={openEdit}
                onDelete={setDeletingTask}
              />
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              ¡Todo hecho por hoy. Increíble trabajo! 🎉
            </p>
          )}
        </div>
      </section>

      {done.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Completadas · {done.length}
          </h2>
          <div className="flex flex-col gap-2.5">
            {done.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={openEdit}
                onDelete={setDeletingTask}
              />
            ))}
          </div>
        </section>
      )}

      {modalOpen && (
        <TaskModal
          key={editingTask?.id ?? 'create'}
          task={editingTask}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deletingTask !== null}
        onOpenChange={(open) => { if (!open) setDeletingTask(null) }}
        title="¿Eliminar tarea?"
        description={`Se eliminará permanentemente "${deletingTask?.title ?? ''}". Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar tarea"
        onConfirm={() => deletingTask ? deleteTask(deletingTask.id) : Promise.resolve()}
      />
    </div>
  )
}
