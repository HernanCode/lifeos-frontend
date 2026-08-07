'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Target, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { goalService } from '@/lib/services/goalService';
import { lifeAreaService } from '@/lib/services/lifeAreaService';
import type { Goal, CreateGoalDto, UpdateGoalDto } from '@/types';

const DEFAULT_FORM: CreateGoalDto = {
  life_area_id: 0,
  title: '',
  specific: null,
  measurable: null,
  achievable_note: null,
  relevant_note: null,
  deadline: null,
};

const STATUS_LABELS = {
  active: { label: 'Activa', color: 'text-green-400 bg-green-400/10' },
  completed: { label: 'Completada', color: 'text-blue-400 bg-blue-400/10' },
  abandoned: { label: 'Abandonada', color: 'text-red-400 bg-red-400/10' },
};

export default function GoalsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form, setForm] = useState<CreateGoalDto>(DEFAULT_FORM);
  const [smartExpanded, setSmartExpanded] = useState(false);

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: goalService.getAll,
  });

  const { data: areas = [] } = useQuery({
    queryKey: ['life-areas'],
    queryFn: lifeAreaService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: goalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGoalDto }) =>
      goalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: goalService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  });

  const openCreate = () => {
    setEditingGoal(null);
    setForm({ ...DEFAULT_FORM, life_area_id: areas[0]?.id ?? 0 });
    setSmartExpanded(false);
    setShowModal(true);
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setForm({
      life_area_id: goal.life_area_id,
      title: goal.title,
      specific: goal.specific,
      measurable: goal.measurable,
      achievable_note: goal.achievable_note,
      relevant_note: goal.relevant_note,
      deadline: goal.deadline,
    });
    setSmartExpanded(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setForm(DEFAULT_FORM);
    setSmartExpanded(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
      updateMutation.mutate({ id: editingGoal.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleStatusChange = (goal: Goal, status: Goal['status']) => {
    updateMutation.mutate({ id: goal.id, data: { status } });
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar esta meta?')) deleteMutation.mutate(id);
  };

  const setField = (field: keyof CreateGoalDto, value: any) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Agrupar metas por área
  const goalsByArea = areas.map((area) => ({
    area,
    goals: goals.filter((g) => g.life_area_id === area.id),
  })).filter(({ goals }) => goals.length > 0);

  const unassignedGoals = goals.filter((g) => !areas.find((a) => a.id === g.life_area_id));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Metas</h2>
          <p className="text-gray-400 mt-1 text-sm">
            Objetivos SMART por área de vida
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
        >
          <Plus size={16} />
          Nueva meta
        </button>
      </div>

      {/* Lista agrupada por área */}
      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-20">
          <Target size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-lg font-medium text-gray-400">No tienes metas creadas</p>
          <p className="text-sm text-gray-600 mt-1">
            Crea tu primera meta SMART para empezar
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {goalsByArea.map(({ area, goals: areaGoals }) => (
            <div key={area.id}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: area.color }}
                />
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {area.name}
                </h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {areaGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    areaColor={area.color}
                    onEdit={() => openEdit(goal)}
                    onDelete={() => handleDelete(goal.id)}
                    onStatusChange={(status) => handleStatusChange(goal, status)}
                  />
                ))}
              </div>
            </div>
          ))}

          {unassignedGoals.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Sin área
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {unassignedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    areaColor="#6366f1"
                    onEdit={() => openEdit(goal)}
                    onDelete={() => handleDelete(goal.id)}
                    onStatusChange={(status) => handleStatusChange(goal, status)}
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-6">
              {editingGoal ? 'Editar meta' : 'Nueva meta'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Área */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Área de vida
                </label>
                <select
                  value={form.life_area_id}
                  onChange={(e) => setField('life_area_id', Number(e.target.value))}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value={0} disabled>Selecciona un área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                  ))}
                </select>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Título de la meta
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  required
                  placeholder="Ej: Correr una 10K en septiembre"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Fecha límite */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha límite
                </label>
                <input
                  type="date"
                  value={form.deadline ?? ''}
                  onChange={(e) => setField('deadline', e.target.value || null)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Campos SMART opcionales */}
              <div>
                <button
                  type="button"
                  onClick={() => setSmartExpanded((p) => !p)}
                  className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition"
                >
                  <span>{smartExpanded ? '▲' : '▼'}</span>
                  {smartExpanded ? 'Ocultar' : 'Añadir'} detalles SMART
                </button>
              </div>

              {smartExpanded && (
                <div className="space-y-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <p className="text-xs text-gray-500">
                    Los campos SMART ayudan a definir mejor tu objetivo y aumentan las probabilidades de éxito.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-400 mb-1">
                      S — Específico
                    </label>
                    <textarea
                      value={form.specific ?? ''}
                      onChange={(e) => setField('specific', e.target.value || null)}
                      placeholder="¿Qué quieres lograr exactamente?"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-400 mb-1">
                      M — Medible
                    </label>
                    <input
                      type="text"
                      value={form.measurable ?? ''}
                      onChange={(e) => setField('measurable', e.target.value || null)}
                      placeholder="¿Cómo sabrás que lo has conseguido?"
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-400 mb-1">
                      A — Alcanzable
                    </label>
                    <textarea
                      value={form.achievable_note ?? ''}
                      onChange={(e) => setField('achievable_note', e.target.value || null)}
                      placeholder="¿Por qué es realista para ti?"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-400 mb-1">
                      R — Relevante
                    </label>
                    <textarea
                      value={form.relevant_note ?? ''}
                      onChange={(e) => setField('relevant_note', e.target.value || null)}
                      placeholder="¿Por qué es importante para ti ahora?"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                    />
                  </div>
                </div>
              )}

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
                  disabled={isPending || form.life_area_id === 0}
                  className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition"
                >
                  {isPending ? 'Guardando...' : editingGoal ? 'Guardar cambios' : 'Crear meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente card de meta
function GoalCard({
  goal,
  areaColor,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  goal: Goal;
  areaColor: string;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Goal['status']) => void;
}) {
  const status = STATUS_LABELS[goal.status];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-white font-medium leading-snug">{goal.title}</h4>
        <div className="flex items-center gap-1 flex-shrink-0">
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

      {goal.measurable && (
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{goal.measurable}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
            {status.label}
          </span>
          {goal.deadline && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={11} />
              {new Date(goal.deadline).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
            </span>
          )}
        </div>

        {/* Cambio rápido de estado */}
        {goal.status === 'active' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onStatusChange('completed')}
              className="p-1 text-gray-600 hover:text-green-400 transition"
              title="Marcar como completada"
            >
              <CheckCircle2 size={16} />
            </button>
            <button
              onClick={() => onStatusChange('abandoned')}
              className="p-1 text-gray-600 hover:text-red-400 transition"
              title="Marcar como abandonada"
            >
              <XCircle size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}