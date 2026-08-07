'use client';

import { useQuery } from '@tanstack/react-query';
import { Target, Repeat2, KanbanSquare, Sparkles, CheckCircle2, Flame, AlertCircle } from 'lucide-react';
import { lifeAreaService } from '@/lib/services/lifeAreaService';
import { goalService } from '@/lib/services/goalService';
import { habitService } from '@/lib/services/habitService';
import { taskService } from '@/lib/services/taskService';
import useAuthStore from '@/store/authStore';
import type { Goal, Task, Habit } from '@/types';

const TODAY = new Date().toISOString().split('T')[0];

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: areas = [] } = useQuery({
    queryKey: ['life-areas'],
    queryFn: lifeAreaService.getAll,
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: goalService.getAll,
  });

  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: habitService.getAll,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getAll(),
  });

  // Cálculos
  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const activeHabits = habits.filter((h) => h.is_active);
  const completedHabitsToday = activeHabits.filter((h) =>
    h.logs?.some((l) => l.date.startsWith(TODAY) && l.completed)
  );

  const pendingTasks = tasks.filter((t) => t.status === 'todo');
  const doingTasks = tasks.filter((t) => t.status === 'doing');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const urgentImportantTasks = tasks.filter(
    (t) => t.is_urgent && t.is_important && t.status !== 'done'
  );

  const habitProgress = activeHabits.length > 0
    ? Math.round((completedHabitsToday.length / activeHabits.length) * 100)
    : 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="space-y-8">
      {/* Saludo */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      {/* Alerta tareas urgentes */}
      {urgentImportantTasks.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm font-medium">
              Tienes {urgentImportantTasks.length} tarea{urgentImportantTasks.length > 1 ? 's' : ''} urgente{urgentImportantTasks.length > 1 ? 's' : ''} e importante{urgentImportantTasks.length > 1 ? 's' : ''}
            </p>
            <ul className="mt-1 space-y-0.5">
              {urgentImportantTasks.slice(0, 3).map((t) => (
                <li key={t.id} className="text-red-300/70 text-xs">· {t.title}</li>
              ))}
              {urgentImportantTasks.length > 3 && (
                <li className="text-red-300/70 text-xs">
                  · y {urgentImportantTasks.length - 3} más...
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Sparkles size={18} />}
          label="Áreas de vida"
          value={areas.length}
          sub={`${activeGoals.length} metas activas`}
          color="text-purple-400"
          bg="bg-purple-400/10"
        />
        <StatCard
          icon={<Target size={18} />}
          label="Metas"
          value={activeGoals.length}
          sub={`${completedGoals.length} completadas`}
          color="text-indigo-400"
          bg="bg-indigo-400/10"
        />
        <StatCard
          icon={<Repeat2 size={18} />}
          label="Hábitos hoy"
          value={`${completedHabitsToday.length}/${activeHabits.length}`}
          sub={`${habitProgress}% completado`}
          color="text-orange-400"
          bg="bg-orange-400/10"
        />
        <StatCard
          icon={<KanbanSquare size={18} />}
          label="Tareas"
          value={pendingTasks.length + doingTasks.length}
          sub={`${doneTasks.length} completadas`}
          color="text-green-400"
          bg="bg-green-400/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progreso hábitos hoy */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Hábitos de hoy</h3>
            <span className="text-xs text-gray-500">{habitProgress}%</span>
          </div>

          {activeHabits.length === 0 ? (
            <p className="text-gray-600 text-sm">No tienes hábitos activos.</p>
          ) : (
            <div className="space-y-3">
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${habitProgress}%` }}
                />
              </div>
              {activeHabits.map((habit) => {
                const done = completedHabitsToday.some((h) => h.id === habit.id);
                return (
                  <HabitMiniRow key={habit.id} habit={habit} done={done} />
                );
              })}
            </div>
          )}
        </div>

        {/* Tareas en progreso */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">En progreso</h3>
          {doingTasks.length === 0 ? (
            <p className="text-gray-600 text-sm">No tienes tareas en progreso.</p>
          ) : (
            <div className="space-y-2">
              {doingTasks.map((task) => (
                <TaskMiniRow key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Metas activas por área */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Metas activas</h3>
          {activeGoals.length === 0 ? (
            <p className="text-gray-600 text-sm">No tienes metas activas.</p>
          ) : (
            <div className="space-y-2">
              {activeGoals.slice(0, 5).map((goal) => (
                <GoalMiniRow key={goal.id} goal={goal} areas={areas} />
              ))}
              {activeGoals.length > 5 && (
                <p className="text-xs text-gray-600 pt-1">
                  +{activeGoals.length - 5} metas más
                </p>
              )}
            </div>
          )}
        </div>

        {/* Próximas tareas pendientes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Próximas tareas</h3>
          {pendingTasks.length === 0 ? (
            <p className="text-gray-600 text-sm">No tienes tareas pendientes.</p>
          ) : (
            <div className="space-y-2">
              {pendingTasks.slice(0, 5).map((task) => (
                <TaskMiniRow key={task.id} task={task} />
              ))}
              {pendingTasks.length > 5 && (
                <p className="text-xs text-gray-600 pt-1">
                  +{pendingTasks.length - 5} tareas más
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-componentes ──

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs font-medium text-gray-300 mt-0.5">{label}</p>
      <p className="text-xs text-gray-600 mt-0.5">{sub}</p>
    </div>
  );
}

function HabitMiniRow({ habit, done }: { habit: Habit; done: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
          done ? 'bg-orange-400 border-orange-400' : 'border-gray-600'
        }`}
      >
        {done && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <p className={`text-sm flex-1 ${done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
        {habit.title}
      </p>
      {done && <Flame size={12} className="text-orange-400" />}
    </div>
  );
}

function TaskMiniRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-medium truncate">{task.title}</p>
        {task.due_date && (
          <p className="text-gray-500 text-xs mt-0.5">
            {new Date(task.due_date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
            })}
          </p>
        )}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {task.is_urgent && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">U</span>
        )}
        {task.is_important && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">I</span>
        )}
      </div>
    </div>
  );
}

function GoalMiniRow({ goal, areas }: { goal: Goal; areas: ReturnType<typeof lifeAreaService.getAll> extends Promise<infer T> ? T : never }) {
  const area = areas.find((a) => a.id === goal.life_area_id);

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
      {area && (
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: area.color }}
        />
      )}
      <p className="text-white text-xs flex-1 truncate">{goal.title}</p>
      {goal.deadline && (
        <p className="text-gray-500 text-xs flex-shrink-0">
          {new Date(goal.deadline).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
          })}
        </p>
      )}
    </div>
  );
}