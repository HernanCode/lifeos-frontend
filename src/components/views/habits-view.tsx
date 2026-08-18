'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Plus, Repeat } from 'lucide-react'
import type { Habit } from '@/types'
import { Button } from '@/components/ui/button'
import { HabitCard } from '@/components/cards/habit-card'
import { HabitModal } from '@/components/modals/habit-modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { SearchInput } from '@/components/ui/search-input'
import { FilterBar } from '@/components/ui/filter-bar'
import { Pagination } from '@/components/ui/pagination'
import { habitStreak, habitWeek, habitFrequencyLabel } from '@/lib/habit-utils'
import { useDashboard } from '@/components/dashboard-provider'
import { HabitCardSkeleton, Skeleton } from '@/components/ui/skeleton'

type StatusFilter = 'all' | 'active' | 'inactive'
const PAGE_SIZE = 6

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Activos', value: 'active' },
  { label: 'Inactivos', value: 'inactive' },
]

export function HabitsView() {
  const router = useRouter()
  const { habits, isLoadingHabits, toggleHabitDay, deleteHabit } = useDashboard()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  const activeHabits = habits.filter((h) => h.is_active)
  const totalStreak = activeHabits.reduce((s, h) => s + habitStreak(h), 0)
  const doneToday = activeHabits.filter((h) => habitWeek(h)[6]).length

  function openCreate() {
    setEditingHabit(null)
    setModalOpen(true)
  }

  function openEdit(habit: Habit) {
    setEditingHabit(habit)
    setModalOpen(true)
  }

  const filtered = useMemo(() => {
    let result = habits
    if (statusFilter === 'active') result = result.filter((h) => h.is_active)
    if (statusFilter === 'inactive') result = result.filter((h) => !h.is_active)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          habitFrequencyLabel(h).toLowerCase().includes(q),
      )
    }
    return result
  }, [habits, statusFilter, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (isLoadingHabits) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">
              Hábitos
            </h1>
            <p className="mt-1 text-muted-foreground">
              Construye rutinas que se queden con rachas diarias constantes.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-3xl bg-muted" />
          <Skeleton className="h-28 rounded-3xl bg-muted" />
          <Skeleton className="h-28 rounded-3xl bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <HabitCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Hábitos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Construye rutinas que se queden con rachas diarias constantes.
          </p>
        </div>
        <Button size="lg" className="h-10 rounded-xl px-4" onClick={openCreate}>
          <Plus className="size-4" />
          Nuevo hábito
        </Button>
      </div>

      {habits.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-gradient-to-br from-brand-orange to-brand-pink p-5 text-white">
            <Flame className="size-6" fill="currentColor" />
            <p className="mt-3 font-display text-2xl font-extrabold">
              {totalStreak}
            </p>
            <p className="text-sm text-white/85">Días totales de racha</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-brand-green to-brand-blue p-5 text-white">
            <p className="font-display text-2xl font-extrabold">
              {doneToday}/{activeHabits.length}
            </p>
            <p className="text-sm text-white/85">Completados hoy</p>
          </div>
          <div className="col-span-2 rounded-3xl border border-border bg-card p-5 sm:col-span-1">
            <p className="font-display text-2xl font-extrabold">
              {activeHabits.length}
            </p>
            <p className="text-sm text-muted-foreground">Hábitos activos</p>
          </div>
        </div>
      )}

      {habits.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No hay hábitos aún"
          description="Creá tu primer hábito para construir rutinas que se queden. Las rachas diarias te van a mantener motivado."
          action
          actionLabel="Crear mi primer hábito"
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1) }}
              placeholder="Buscar hábitos..."
              className="w-full sm:w-64"
            />
            <FilterBar
              filters={STATUS_FILTERS}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1) }}
            />
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No se encontraron hábitos con esos filtros.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginated.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggleDay={toggleHabitDay}
                    onEdit={openEdit}
                    onDelete={setDeletingHabit}
                    onClick={(h) => router.push(`/habits/${h.id}`)}
                  />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}

      {modalOpen && (
        <HabitModal
          key={editingHabit?.id ?? 'create'}
          habit={editingHabit}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deletingHabit !== null}
        onOpenChange={(open) => { if (!open) setDeletingHabit(null) }}
        title="¿Eliminar hábito?"
        description={`Se eliminará permanentemente "${deletingHabit?.title ?? ''}". Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar hábito"
        onConfirm={() => deletingHabit ? deleteHabit(deletingHabit.id) : Promise.resolve()}
      />
    </div>
  )
}
