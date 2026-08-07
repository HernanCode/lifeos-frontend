'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Flame, Repeat2 } from 'lucide-react';
import { habitService } from '@/lib/services/habitService';
import { goalService } from '@/lib/services/goalService';
import type { Habit, CreateHabitDto } from '@/types';

const DEFAULT_FORM: CreateHabitDto = {
  title: '',
  frequency: 'daily',
  target_count: 1,
};

const FREQUENCY_LABELS = {
  daily: 'Diario',
  weekly: 'Semanal',
  custom: 'Personalizado',
};

const TODAY = new Date().toISOString().split('T')[0];

export default function HabitsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [form, setForm] = useState<CreateHabitDto>(DEFAULT_FORM);

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitService.getAll,
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: goalService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: habitService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateHabitDto> }) =>
      habitService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: habitService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      habitService.toggle(id, completed),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });

  const openCreate = () => {
    setEditingHabit(null);
    setForm(DEFAULT_FORM);
    setShowModal(true);
  };

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setForm({
      title: habit.title,
      frequency: habit.frequency,
      target_count: habit.target_count,
      goal_id: habit.goal_id ?? undefined,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHabit(null);
    setForm(DEFAULT_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHabit) {
      updateMutation.mutate({ id: editingHabit.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este hábito?')) deleteMutation.mutate(id);
  };

  const isCompletedToday = (habit: Habit) => {
    return habit.logs?.some(
      (log) => log.date.startsWith(TODAY) && log.completed
    ) ?? false;
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const activeHabits = habits.filter((h) => h.is_active);
  const inactiveHabits = habits.filter((h) => !h.is_active);

  const completedToday = activeHabits.filter(isCompletedToday).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Hábitos</h2>
          <p className="text-gray-400 mt-1 text-sm">
            {completedToday} de {activeHabits.length} completados hoy
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
        >
          <Plus size={16} />
          Nuevo hábito
        </button>
      </div>

      {/* Progreso del día */}
      {activeHabits.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progreso de hoy</span>
            <span className="text-sm font-medium text-white">
              {Math.round((completedToday / activeHabits.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{
                width: `${(completedToday / activeHabits.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Lista hábitos activos */}
      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando...</div>
      ) : habits.length === 0 ? (
        <div className="text-center py-20">
          <Repeat2 size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-lg font-medium text-gray-400">No tienes hábitos creados</p>
          <p className="text-sm text-gray-600 mt-1">
            Crea hábitos diarios vinculados a tus metas
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {activeHabits.length > 0 && (
            <div className="space-y-3">
              {activeHabits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  completedToday={isCompletedToday(habit)}
                  onToggle={(completed) =>
                    toggleMutation.mutate({ id: habit.id, completed })
                  }
                  onEdit={() => openEdit(habit)}
                  onDelete={() => handleDelete(habit.id)}
                />
              ))}
            </div>
          )}

          {inactiveHabits.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Inactivos
              </h3>
              <div className="space-y-3 opacity-50">
                {inactiveHabits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    completedToday={false}
                    onToggle={() => {}}
                    onEdit={() => openEdit(habit)}
                    onDelete={() => handleDelete(habit.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-6">
              {editingHabit ? 'Editar hábito' : 'Nuevo hábito'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="Ej: Meditar 10 minutos"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Frecuencia
                </label>
                <select
                  value={form.frequency}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, frequency: e.target.value as Habit['frequency'] }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Meta vinculada (opcional)
                </label>
                <select
                  value={form.goal_id ?? ''}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      goal_id: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="">Sin meta</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
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
                  {isPending ? 'Guardando...' : editingHabit ? 'Guardar' : 'Crear hábito'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente fila de hábito
function HabitRow({
  habit,
  completedToday,
  onToggle,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  completedToday: boolean;
  onToggle: (completed: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition ${
        completedToday
          ? 'bg-indigo-600/10 border-indigo-600/30'
          : 'bg-gray-900 border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(!completedToday)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
          completedToday
            ? 'bg-indigo-600 border-indigo-600'
            : 'border-gray-600 hover:border-indigo-500'
        }`}
      >
        {completedToday && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${completedToday ? 'text-white line-through opacity-60' : 'text-white'}`}>
          {habit.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {FREQUENCY_LABELS[habit.frequency]}
          {habit.goal && ` · ${habit.goal.title}`}
        </p>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1 text-orange-400">
        <Flame size={14} />
        <span className="text-xs font-medium">
          {habit.logs?.filter((l) => l.completed).length ?? 0}
        </span>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}