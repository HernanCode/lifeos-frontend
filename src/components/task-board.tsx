'use client'

import { useMemo, useRef, useState } from 'react'
import type { Task, UpdateTaskDto } from '@/types'
import { TaskItem } from '@/components/cards/task-item'
import { TaskModal } from '@/components/modals/task-modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { SearchInput } from '@/components/ui/search-input'
import { FilterBar } from '@/components/ui/filter-bar'
import { Pagination } from '@/components/ui/pagination'
import { TaskItemSkeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'

type StatusFilter = 'todo' | 'doing' | 'done'
const PAGE_SIZE = 10

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'Por hacer', value: 'todo' },
  { label: 'En progreso', value: 'doing' },
  { label: 'Completadas', value: 'done' },
]

export function TaskBoard({
  tasks,
  isLoading,
  search,
  onSearchChange,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  extraFilters,
  onCreateTask,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  defaultProjectId,
}: {
  tasks: Task[]
  isLoading: boolean
  search: string
  onSearchChange: (v: string) => void
  onToggleTask: (id: number) => void
  onUpdateTask: (id: number, data: UpdateTaskDto) => void
  onDeleteTask: (id: number) => void
  extraFilters?: React.ReactNode
  onCreateTask?: () => void
  emptyIcon?: React.ComponentType<{ className?: string }>
  emptyTitle?: string
  emptyDescription?: string
  emptyActionLabel?: string
  defaultProjectId?: number | null
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todo')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const draggedId = useRef<number | null>(null)

  function handleDragStart(_e: React.DragEvent, task: Task) {
    draggedId.current = task.id
  }

  function handleDropToStatus(status: StatusFilter) {
    if (!draggedId.current) return
    onUpdateTask(draggedId.current, { status })
    draggedId.current = null
  }

  const filtered = useMemo(() => {
    let result = tasks.filter((t) => t.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      )
    }
    return result
  }, [tasks, statusFilter, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openEdit(task: Task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function openCreate() {
    setEditingTask(null)
    setModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <TaskItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (tasks.length === 0 && !search.trim()) {
    return (
      <EmptyState
        icon={emptyIcon ?? Plus}
        title={emptyTitle ?? 'No hay tareas aún'}
        description={emptyDescription ?? 'Creá tu primera tarea para empezar.'}
        action
        actionLabel={emptyActionLabel ?? 'Crear mi primera tarea'}
        onAction={onCreateTask ?? openCreate}
      />
    )
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(v) => { onSearchChange(v); setPage(1) }}
          placeholder="Buscar tareas..."
          className="w-full sm:w-64"
        />
        {extraFilters}
        <div className="flex flex-wrap items-center gap-3">
          <FilterBar
            filters={STATUS_FILTERS}
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1) }}
            onDrop={handleDropToStatus}
            dropTargets={new Set<StatusFilter>(['todo', 'doing', 'done'])}
          />
          <span className="text-xs text-muted-foreground/60">
            Arrastrá las tareas a un filtro para cambiar su estado
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No se encontraron tareas con esos filtros.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {paginated.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onEdit={openEdit}
                onDelete={setDeletingTask}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {modalOpen && (
        <TaskModal
          key={editingTask?.id ?? 'create'}
          task={editingTask}
          defaultProjectId={defaultProjectId}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deletingTask !== null}
        onOpenChange={(open) => { if (!open) setDeletingTask(null) }}
        title="¿Eliminar tarea?"
        description={`Se eliminará permanentemente "${deletingTask?.title ?? ''}". Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar tarea"
        onConfirm={() => deletingTask ? onDeleteTask(deletingTask.id) : Promise.resolve()}
      />
    </>
  )
}
