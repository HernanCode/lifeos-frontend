'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, GripVertical } from 'lucide-react';
import { taskService } from '@/lib/services/taskService';
import { goalService } from '@/lib/services/goalService';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

const COLUMNS: { key: Task['status']; label: string; color: string }[] = [
  { key: 'todo', label: 'Por hacer', color: 'border-gray-700' },
  { key: 'doing', label: 'En progreso', color: 'border-indigo-500' },
  { key: 'done', label: 'Hecho', color: 'border-green-500' },
];

const DEFAULT_FORM: CreateTaskDto = {
  title: '',
  description: undefined,
  is_urgent: false,
  is_important: false,
  due_date: undefined,
  goal_id: undefined,
};

type ViewMode = 'kanban' | 'eisenhower';

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<CreateTaskDto>(DEFAULT_FORM);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getAll(),
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: goalService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      taskService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const openCreate = (status: Task['status'] = 'todo') => {
    setEditingTask(null);
    setForm({ ...DEFAULT_FORM, status });
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description ?? undefined,
      is_urgent: task.is_urgent,
      is_important: task.is_important,
      due_date: task.due_date ?? undefined,
      goal_id: task.goal_id ?? undefined,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setForm(DEFAULT_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleStatusChange = (task: Task, status: Task['status']) => {
    updateMutation.mutate({ id: task.id, data: { status } });
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar esta tarea?')) deleteMutation.mutate(id);
  };

  const setField = (field: keyof CreateTaskDto, value: any) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Datos para Eisenhower (solo tareas no completadas)
  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const q1 = activeTasks.filter((t) => t.is_urgent && t.is_important);
  const q2 = activeTasks.filter((t) => !t.is_urgent && t.is_important);
  const q3 = activeTasks.filter((t) => t.is_urgent && !t.is_important);
  const q4 = activeTasks.filter((t) => !t.is_urgent && !t.is_important);

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Tareas</h2>
          <p className="text-gray-400 mt-1 text-sm">
            {tasks.filter((t) => t.status === 'done').length} de {tasks.length} completadas
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Toggle vista */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'kanban'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('eisenhower')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'eisenhower'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Eisenhower
            </button>
          </div>

          <button
            onClick={() => openCreate()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
          >
            <Plus size={16} />
            Nueva tarea
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando...</div>
      ) : viewMode === 'kanban' ? (
        // ── VISTA KANBAN ──
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(({ key, label, color }) => {
            const columnTasks = tasks.filter((t) => t.status === key);
            return (
              <div key={key} className="flex flex-col">
                {/* Cabecera columna */}
                <div className={`flex items-center justify-between mb-3 pb-3 border-b-2 ${color}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{label}</span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openCreate(key)}
                    className="p-1 text-gray-600 hover:text-white transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Tarjetas */}
                <div className="space-y-3 flex-1">
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-700 text-sm border border-dashed border-gray-800 rounded-xl">
                      Sin tareas
                    </div>
                  )}
                  {columnTasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      onEdit={() => openEdit(task)}
                      onDelete={() => handleDelete(task.id)}
                      onStatusChange={(status) => handleStatusChange(task, status)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // ── VISTA EISENHOWER ──
        <div>
          <p className="text-xs text-gray-500 mb-4">
            Solo se muestran tareas no completadas. Marca urgente e importante al crear o editar una tarea.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <EisenhowerQuadrant
              title="Hacer ahora"
              subtitle="Urgente + Importante"
              tasks={q1}
              color="border-red-500"
              badge="bg-red-500/10 text-red-400"
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
            <EisenhowerQuadrant
              title="Planificar"
              subtitle="No urgente + Importante"
              tasks={q2}
              color="border-indigo-500"
              badge="bg-indigo-500/10 text-indigo-400"
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
            <EisenhowerQuadrant
              title="Delegar"
              subtitle="Urgente + No importante"
              tasks={q3}
              color="border-yellow-500"
              badge="bg-yellow-500/10 text-yellow-400"
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
            <EisenhowerQuadrant
              title="Eliminar"
              subtitle="No urgente + No importante"
              tasks={q4}
              color="border-gray-600"
              badge="bg-gray-500/10 text-gray-400"
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-6">
              {editingTask ? 'Editar tarea' : 'Nueva tarea'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  required
                  placeholder="Ej: Llamar al médico"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) => setField('description', e.target.value || undefined)}
                  placeholder="Detalles adicionales..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha límite (opcional)
                </label>
                <input
                  type="date"
                  value={form.due_date ?? ''}
                  onChange={(e) => setField('due_date', e.target.value || undefined)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Meta vinculada (opcional)
                </label>
                <select
                  value={form.goal_id ?? ''}
                  onChange={(e) =>
                    setField('goal_id', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="">Sin meta</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>{goal.title}</option>
                  ))}
                </select>
              </div>

              {/* Eisenhower toggles */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prioridad (Eisenhower)
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setField('is_urgent', !form.is_urgent)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                      form.is_urgent
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    🔥 Urgente
                  </button>
                  <button
                    type="button"
                    onClick={() => setField('is_important', !form.is_important)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                      form.is_important
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    ⭐ Importante
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition"
                >
                  {isPending ? 'Guardando...' : editingTask ? 'Guardar' : 'Crear tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Componente tarjeta Kanban ──
function KanbanCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Task['status']) => void;
}) {
  const nextStatus: Record<Task['status'], Task['status'] | null> = {
    todo: 'doing',
    doing: 'done',
    done: null,
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition group">
      <div className="flex items-start gap-2 mb-2">
        <GripVertical size={14} className="text-gray-700 mt-0.5 flex-shrink-0" />
        <p className="text-white text-sm font-medium flex-1 leading-snug">{task.title}</p>
      </div>

      {task.description && (
        <p className="text-gray-500 text-xs mb-3 ml-5 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-1.5 ml-5 mb-3 flex-wrap">
        {task.is_urgent && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">Urgente</span>
        )}
        {task.is_important && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">Importante</span>
        )}
        {task.due_date && (
          <span className="text-xs text-gray-500">
            {new Date(task.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between ml-5">
        {nextStatus[task.status] ? (
          <button
            onClick={() => onStatusChange(nextStatus[task.status]!)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition"
          >
            Mover →
          </button>
        ) : (
          <span className="text-xs text-green-400">✓ Completada</span>
        )}

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={onEdit}
            className="p-1 text-gray-500 hover:text-white transition"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-500 hover:text-red-400 transition"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente cuadrante Eisenhower ──
function EisenhowerQuadrant({
  title,
  subtitle,
  tasks,
  color,
  badge,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  title: string;
  subtitle: string;
  tasks: Task[];
  color: string;
  badge: string;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (task: Task, status: Task['status']) => void;
}) {
  return (
    <div className={`bg-gray-900 border-2 ${color} rounded-xl p-4`}>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
            {tasks.length}
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 && (
          <p className="text-gray-700 text-xs text-center py-4">Sin tareas</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition group"
          >
            <p className="text-white text-xs flex-1 leading-snug">{task.title}</p>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
              <button
                onClick={() => onStatusChange(task, 'done')}
                className="p-1 text-gray-500 hover:text-green-400 transition"
                title="Marcar como hecha"
              >
                ✓
              </button>
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-500 hover:text-white transition"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-500 hover:text-red-400 transition"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}