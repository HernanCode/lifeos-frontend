'use client'

import { useState, type FormEvent } from 'react'
import type { CreateProjectDto, Project, UpdateProjectDto } from '@/types'
import { useDashboard } from '@/components/dashboard-provider'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Field, Select, TextArea, TextInput } from '@/components/ui/form'

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const { createProject, updateProject } = useDashboard()
  const isEditing = project !== null
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [status, setStatus] = useState<Project['status']>(project?.status ?? 'active')
  const [color, setColor] = useState(project?.color ?? '#3B82F6')
  const [dueDate, setDueDate] = useState(project?.due_date ?? '')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload: CreateProjectDto & { status?: Project['status'] } = {
        name,
        status,
        color,
        ...(description ? { description } : {}),
        ...(dueDate ? { due_date: dueDate } : {}),
      }
      if (isEditing && project) {
        await updateProject(project.id, payload as UpdateProjectDto)
      } else {
        await createProject(payload)
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
      title={isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}
      description={
        isEditing
          ? 'Actualiza los detalles de este proyecto.'
          : 'Crea un nuevo proyecto para organizar tus tareas.'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Nombre" htmlFor="project-name" required>
          <TextInput
            id="project-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Rediseño de la web"
            autoFocus
          />
        </Field>

        <Field label="Descripción" htmlFor="project-description">
          <TextArea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el proyecto (opcional)"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Estado" htmlFor="project-status">
            <Select
              id="project-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Project['status'])}
            >
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
              <option value="completed">Completado</option>
              <option value="archived">Archivado</option>
            </Select>
          </Field>
          <Field label="Color" htmlFor="project-color">
            <div className="flex items-center gap-3">
              <input
                id="project-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="size-10 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
              />
              <TextInput
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </Field>
        </div>

        <Field label="Fecha límite" htmlFor="project-due">
          <TextInput
            id="project-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Field>

        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear proyecto'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
