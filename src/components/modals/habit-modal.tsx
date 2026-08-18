'use client'

import { useState, type FormEvent } from 'react'
import type { CreateHabitDto, Habit } from '@/types'
import { useDashboard } from '@/components/dashboard-provider'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Field, Select, TextInput, Toggle } from '@/components/ui/form'

export function HabitModal({ habit, onClose }: { habit: Habit | null; onClose: () => void }) {
  const { goals, createHabit, updateHabit } = useDashboard()
  const isEditing = habit !== null
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState(habit?.title ?? '')
  const [frequency, setFrequency] = useState<Habit['frequency']>(
    habit?.frequency ?? 'daily',
  )
  const [targetCount, setTargetCount] = useState(habit?.target_count ?? 1)
  const [goalId, setGoalId] = useState(
    habit?.goal_id != null ? String(habit.goal_id) : '',
  )
  const [isActive, setIsActive] = useState(habit?.is_active ?? true)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload: CreateHabitDto = {
        title,
        frequency,
        target_count: Math.max(1, Number(targetCount) || 1),
        ...(goalId ? { goal_id: Number(goalId) } : {}),
      }
      if (isEditing && habit) {
        await updateHabit(habit.id, { ...payload, is_active: isActive })
      } else {
        await createHabit(payload)
      }
      onClose()
    } catch {
      // toast already shown
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
      title={isEditing ? 'Editar hábito' : 'Nuevo hábito'}
      description={
        isEditing
          ? 'Actualiza los detalles de este hábito.'
          : 'Construye una rutina que se quede con rachas diarias constantes.'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Título" htmlFor="habit-title" required>
          <TextInput
            id="habit-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Beber 2L de agua"
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Frecuencia" htmlFor="habit-frequency">
            <Select
              id="habit-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Habit['frequency'])}
            >
              <option value="daily">Diaria</option>
              <option value="weekly">Semanal</option>
              <option value="custom">Personalizada</option>
            </Select>
          </Field>
          <Field
            label={
              frequency === 'weekly'
                ? 'Veces por semana'
                : frequency === 'daily'
                  ? 'Veces al día'
                  : 'Objetivo'
            }
            htmlFor="habit-target"
          >
            <TextInput
              id="habit-target"
              type="number"
              min={1}
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value))}
            />
          </Field>
        </div>

        {frequency === 'weekly' && (
          <p className="-mt-2 text-xs text-muted-foreground">
            Cuántas veces querés hacer esto por semana. Marcá los días que lo hagas en la grilla.
          </p>
        )}

        <Field label="Meta" htmlFor="habit-goal">
          <Select id="habit-goal" value={goalId} onChange={(e) => setGoalId(e.target.value)}>
            <option value="">Sin meta</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </Select>
        </Field>

        {isEditing && <Toggle label="Activo" checked={isActive} onChange={setIsActive} />}

        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear hábito'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
