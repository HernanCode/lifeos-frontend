'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { lifeAreaService } from '@/lib/services/lifeAreaService';
import type { LifeArea, CreateLifeAreaDto } from '@/types';

const COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ef4444',
  '#06b6d4', '#a855f7', '#ec4899', '#14b8a6',
];

const DEFAULT_FORM: CreateLifeAreaDto = {
  name: '',
  color: '#6366f1',
};

export default function AreasPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState<LifeArea | null>(null);
  const [form, setForm] = useState<CreateLifeAreaDto>(DEFAULT_FORM);

  const { data: areas = [], isLoading } = useQuery({
    queryKey: ['life-areas'],
    queryFn: lifeAreaService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: lifeAreaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['life-areas'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateLifeAreaDto> }) =>
      lifeAreaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['life-areas'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: lifeAreaService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['life-areas'] }),
  });

  const openCreate = () => {
    setEditingArea(null);
    setForm(DEFAULT_FORM);
    setShowModal(true);
  };

  const openEdit = (area: LifeArea) => {
    setEditingArea(area);
    setForm({ name: area.name, color: area.color });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingArea(null);
    setForm(DEFAULT_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArea) {
      updateMutation.mutate({ id: editingArea.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar esta área? Se eliminarán también sus metas.')) {
      deleteMutation.mutate(id);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Áreas de vida</h2>
          <p className="text-gray-400 mt-1 text-sm">
            Organiza tu vida en grandes ámbitos
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
        >
          <Plus size={16} />
          Nueva área
        </button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="text-gray-500 text-sm">Cargando...</div>
      ) : areas.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-lg font-medium text-gray-400">No tienes áreas creadas</p>
          <p className="text-sm mt-1">Empieza añadiendo áreas como Salud, Finanzas o Social</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map((area) => (
            <div
              key={area.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 hover:border-gray-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: area.color + '33' }}
                  >
                    <div
                      className="w-full h-full rounded-lg flex items-center justify-center"
                      style={{ color: area.color }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: area.color }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{area.name}</h3>
                    <p className="text-gray-500 text-xs">
                      {area.goals?.length ?? 0} metas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(area)}
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(area.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-400 transition cursor-pointer">
                <span>Ver metas</span>
                <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-6">
              {editingArea ? 'Editar área' : 'Nueva área de vida'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="Ej: Salud, Finanzas, Social..."
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, color }))}
                      className={`w-8 h-8 rounded-full transition border-2 ${
                        form.color === color
                          ? 'border-white scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
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
                  {isPending ? 'Guardando...' : editingArea ? 'Guardar cambios' : 'Crear área'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}