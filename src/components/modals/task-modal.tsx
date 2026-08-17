'use client'

import { useState, type FormEvent } from 'react'
import type { CreateTaskDto, Task, UpdateTaskDto } from '@/types'
import { useDashboard } from '@/components/dashboard-provider'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Field, Select, TextArea, TextInput, Toggle } from '@/components/ui/form'

export function TaskModal({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const { goals, createTask, updateTask } = useDashboard()
  const isEditing = task !== null
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<Task['status']>(task?.status ?? 'todo')
  const [goalId, setGoalId] = useState(
    task?.goal_id != null ? String(task.goal_id) : '',
  )
  const [dueDate, setDueDate] = useState(task?.due_date ?? '')
  const [isUrgent, setIsUrgent] = useState(task?.is_urgent ?? false)
  const [isImportant, setIsImportant] = useState(task?.is_important ?? false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload: CreateTaskDto & { status?: Task['status'] } = {
        title,
        status,
        is_urgent: isUrgent,
        is_important: isImportant,
        ...(description ? { description } : {}),
        ...(goalId ? { goal_id: Number(goalId) } : {}),
        ...(dueDate ? { due_date: dueDate } : {}),
      }
      if (isEditing && task) {
        await updateTask(task.id, payload as UpdateTaskDto)
      } else {
        await createTask(payload)
      }
      onClose()
    } catch {
      // toast already shown by handleMutationError
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={isEditing ? 'Editar tarea' : 'Nueva tarea'}
      description={
        isEditing
          ? 'Actualiza los detalles de esta tarea.'
          : 'Captura una nueva tarea y sigue el impísin.'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Título" htmlFor="task-title" required>
          <TextInput
            id="task-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Terminar el reporte trimestral"
            autoFocus
          />
        </Field>

        <Field label="Descripción" htmlFor="task-description">
          <TextArea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Agregar más detalles (opcional)"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Estado" htmlFor="task-status">
            <Select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Task['status'])}
            >
              <option value="todo">Por hacer</option>
              <option value="doing">En progreso</option>
              <option value="done">Hecho</option>
            </Select>
          </Field>
          <Field label="Meta" htmlFor="task-goal">
            <Select
              id="task-goal"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
            >
              <option value="">Sin meta</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Fecha límite" htmlFor="task-due">
          <TextInput
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Toggle label="Urgente" checked={isUrgent} onChange={setIsUrgent} />
          <Toggle label="Importante" checked={isImportant} onChange={setIsImportant} />
        </div>

        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear tarea'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
