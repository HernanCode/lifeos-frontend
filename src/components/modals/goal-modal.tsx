'use client'

import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import type { CreateGoalDto, Goal } from '@/types'
import { useDashboard } from '@/components/dashboard-provider'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Field, Select, TextArea, TextInput } from '@/components/ui/form'
import { cn } from '@/lib/utils'

const AREA_COLORS = ['blue', 'purple', 'green', 'orange', 'pink'] as const
const AREA_COLOR_CLASSES: Record<(typeof AREA_COLORS)[number], string> = {
  blue: 'bg-brand-blue',
  purple: 'bg-brand-purple',
  green: 'bg-brand-green',
  orange: 'bg-brand-orange',
  pink: 'bg-brand-pink',
}

export function GoalModal({ goal, onClose }: { goal: Goal | null; onClose: () => void }) {
  const { lifeAreas, createGoal, updateGoal, createLifeArea } = useDashboard()
  const isEditing = goal !== null
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState(goal?.title ?? '')
  const [lifeAreaId, setLifeAreaId] = useState(
    goal?.life_area_id != null ? String(goal.life_area_id) : '',
  )
  const [specific, setSpecific] = useState(goal?.specific ?? '')
  const [measurable, setMeasurable] = useState(goal?.measurable ?? '')
  const [achievable, setAchievable] = useState(goal?.achievable_note ?? '')
  const [relevant, setRelevant] = useState(goal?.relevant_note ?? '')
  const [deadline, setDeadline] = useState(goal?.deadline ?? '')
  const [status, setStatus] = useState<Goal['status']>(goal?.status ?? 'active')

  const [showNewArea, setShowNewArea] = useState(false)
  const [areaName, setAreaName] = useState('')
  const [areaColor, setAreaColor] = useState<(typeof AREA_COLORS)[number]>('blue')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      let areaId: string | null = lifeAreaId || null
      if (showNewArea && areaName.trim()) {
        const area = await createLifeArea({ name: areaName.trim(), color: areaColor })
        areaId = String(area.id)
      }
      if (!areaId) return
      const payload: CreateGoalDto = {
        title,
        life_area_id: Number(areaId),
        specific: specific || null,
        measurable: measurable || null,
        achievable_note: achievable || null,
        relevant_note: relevant || null,
        deadline: deadline || null,
      }
      if (isEditing && goal) {
        await updateGoal(goal.id, { ...payload, status })
      } else {
        await createGoal(payload)
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
      title={isEditing ? 'Editar meta' : 'Nueva meta'}
      description={
        isEditing
          ? 'Actualiza los detalles de esta meta.'
          : 'Establece una meta SMART y sigue las cosas que importan.'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Título" htmlFor="goal-title" required>
          <TextInput
            id="goal-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Correr una media maratón"
            autoFocus
          />
        </Field>

        {showNewArea ? (
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-4">
            <Field label="Nueva área de vida" htmlFor="goal-area-name" required>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <TextInput
                  id="goal-area-name"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="Ej. Salud"
                  className="h-10"
                />
                <div className="flex shrink-0 items-center justify-between gap-1.5 sm:justify-start">
                  {AREA_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAreaColor(c)}
                      aria-label={`Color ${c}`}
                      className={cn(
                        'size-6 rounded-full transition-all',
                        AREA_COLOR_CLASSES[c],
                        areaColor === c
                          ? 'ring-2 ring-ring ring-offset-2'
                          : 'opacity-50 hover:opacity-100',
                      )}
                    />
                  ))}
                </div>
              </div>
            </Field>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-end text-muted-foreground"
              onClick={() => {
                setShowNewArea(false)
                setAreaName('')
              }}
            >
              Cancelar nueva área
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNewArea(true)}
            className="flex items-center gap-1.5 self-start rounded-lg px-2 py-1 text-sm font-semibold text-brand-purple transition-colors hover:bg-brand-purple-soft"
          >
            <Plus className="size-4" />
            Nueva área de vida
          </button>
        )}

        <Field label="Área de vida" htmlFor="goal-area" required={!showNewArea}>
          <Select
            id="goal-area"
            value={lifeAreaId}
            onChange={(e) => setLifeAreaId(e.target.value)}
            required={!showNewArea}
            disabled={showNewArea}
          >
            <option value="">Seleccionar área</option>
            {lifeAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Específico" htmlFor="goal-specific">
          <TextArea
            id="goal-specific"
            value={specific}
            onChange={(e) => setSpecific(e.target.value)}
            placeholder="¿Qué exactamente quieres lograr?"
          />
        </Field>
        <Field label="Medible" htmlFor="goal-measurable">
          <TextInput
            id="goal-measurable"
            value={measurable}
            onChange={(e) => setMeasurable(e.target.value)}
            placeholder="¿Cómo medirás el progreso?"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Alcanzable" htmlFor="goal-achievable">
            <TextInput
              id="goal-achievable"
              value={achievable}
              onChange={(e) => setAchievable(e.target.value)}
              placeholder="¿Por qué es alcanzable?"
            />
          </Field>
          <Field label="Relevante" htmlFor="goal-relevant">
            <TextInput
              id="goal-relevant"
              value={relevant}
              onChange={(e) => setRelevant(e.target.value)}
              placeholder="¿Por qué es importante?"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Fecha límite" htmlFor="goal-deadline">
            <TextInput
              id="goal-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Field>
          {isEditing && (
            <Field label="Estado" htmlFor="goal-status">
              <Select
                id="goal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Goal['status'])}
              >
                <option value="active">Activa</option>
                <option value="completed">Completada</option>
                <option value="abandoned">Abandonada</option>
              </Select>
            </Field>
          )}
        </div>

        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear meta'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
