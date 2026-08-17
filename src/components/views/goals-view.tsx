'use client'

import { useState } from 'react'
import { Plus, Trophy } from 'lucide-react'
import type { Goal } from '@/types'
import { Button } from '@/components/ui/button'
import { GoalCard } from '@/components/cards/goal-card'
import { GoalModal } from '@/components/modals/goal-modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useDashboard } from '@/components/dashboard-provider'
import { GoalCardSkeleton } from '@/components/ui/skeleton'

export function GoalsView() {
  const { goals, isLoadingGoals, deleteGoal } = useDashboard()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null)

  function openCreate() {
    setEditingGoal(null)
    setModalOpen(true)
  }

  function openEdit(goal: Goal) {
    setEditingGoal(goal)
    setModalOpen(true)
  }

  if (isLoadingGoals) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">
              Metas
            </h1>
            <p className="mt-1 text-muted-foreground">
              Sigue las cosas que importan y mira cómo crece tu progreso.
            </p>
          </div>
        </div>
        <div className="h-24 w-full animate-pulse rounded-3xl bg-muted" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GoalCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  const completed = goals.filter((g) => g.status === 'completed').length
  const avg = goals.length ? Math.round((completed / goals.length) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Metas
          </h1>
          <p className="mt-1 text-muted-foreground">
            Sigue las cosas que importan y mira cómo crece tu progreso.
          </p>
        </div>
        <Button size="lg" className="h-10 rounded-xl px-4" onClick={openCreate}>
          <Plus className="size-4" />
          Nueva meta
        </Button>
      </div>

      <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-orange to-brand-pink p-6 text-white">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20">
          <Trophy className="size-7" />
        </div>
        <div>
          <p className="text-sm font-medium text-white/85">
            Completación general de metas
          </p>
          <p className="font-display text-3xl font-extrabold">{avg}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={openEdit}
            onDelete={setDeletingGoal}
          />
        ))}
      </div>

      {modalOpen && (
        <GoalModal
          key={editingGoal?.id ?? 'create'}
          goal={editingGoal}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deletingGoal !== null}
        onOpenChange={(open) => { if (!open) setDeletingGoal(null) }}
        title="¿Eliminar meta?"
        description={`Se eliminará permanentemente "${deletingGoal?.title ?? ''}". Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar meta"
        onConfirm={() => deletingGoal ? deleteGoal(deletingGoal.id) : Promise.resolve()}
      />
    </div>
  )
}
