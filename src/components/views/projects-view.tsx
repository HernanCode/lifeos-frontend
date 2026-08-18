'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FolderKanban } from 'lucide-react'
import type { Project } from '@/types'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/cards/project-card'
import { ProjectModal } from '@/components/modals/project-modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { SearchInput } from '@/components/ui/search-input'
import { FilterBar } from '@/components/ui/filter-bar'
import { Pagination } from '@/components/ui/pagination'
import { useDashboard } from '@/components/dashboard-provider'
import { Skeleton } from '@/components/ui/skeleton'

type StatusFilter = 'all' | 'active' | 'paused' | 'completed' | 'archived'
const PAGE_SIZE = 9

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Activos', value: 'active' },
  { label: 'Pausados', value: 'paused' },
  { label: 'Completados', value: 'completed' },
  { label: 'Archivados', value: 'archived' },
]

export function ProjectsView() {
  const { projects, isLoadingProjects, deleteProject } = useDashboard()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  function openCreate() {
    setEditingProject(null)
    setModalOpen(true)
  }

  function openEdit(project: Project) {
    setEditingProject(project)
    setModalOpen(true)
  }

  const filtered = useMemo(() => {
    let result = projects
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      )
    }
    return result
  }, [projects, statusFilter, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeCount = projects.filter((p) => p.status === 'active').length
  const completedCount = projects.filter((p) => p.status === 'completed').length

  if (isLoadingProjects) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">
              Proyectos
            </h1>
            <p className="mt-1 text-muted-foreground">
              Organiza tus tareas en proyectos para mantener el orden.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-3xl" />
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
            Proyectos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Organiza tus tareas en proyectos para mantener el orden.
          </p>
        </div>
        <Button size="lg" className="h-10 rounded-xl px-4" onClick={openCreate}>
          <Plus className="size-4" />
          Nuevo proyecto
        </Button>
      </div>

      <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-blue to-brand-purple p-6 text-white">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20">
          <FolderKanban className="size-7" />
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-sm font-medium text-white/85">Activos</p>
            <p className="font-display text-3xl font-extrabold">{activeCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-white/85">Completados</p>
            <p className="font-display text-3xl font-extrabold">{completedCount}</p>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No hay proyectos aún"
          description="Crea tu primer proyecto para organizar tus tareas y seguir tu progreso."
          action
          actionLabel="Crear mi primer proyecto"
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1) }}
              placeholder="Buscar proyectos..."
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
              No se encontraron proyectos con esos filtros.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginated.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={openEdit}
                    onDelete={setDeletingProject}
                    onClick={(p) => router.push(`/projects/${p.id}`)}
                  />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}

      {modalOpen && (
        <ProjectModal
          key={editingProject?.id ?? 'create'}
          project={editingProject}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deletingProject !== null}
        onOpenChange={(open) => { if (!open) setDeletingProject(null) }}
        title="¿Eliminar proyecto?"
        description={`Se eliminará permanentemente "${deletingProject?.name ?? ''}". Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar proyecto"
        onConfirm={() => deletingProject ? deleteProject(deletingProject.id) : Promise.resolve()}
      />
    </div>
  )
}
