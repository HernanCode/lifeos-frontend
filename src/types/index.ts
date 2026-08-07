export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LifeArea {
  id: number;
  user_id: number;
  name: string;
  color: string;
  icon: string | null;
  goals?: Goal[];
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: number;
  life_area_id: number;
  user_id: number;
  title: string;
  specific: string | null;
  measurable: string | null;
  achievable_note: string | null;
  relevant_note: string | null;
  deadline: string | null;
  status: 'active' | 'completed' | 'abandoned';
  life_area?: LifeArea;
  habits?: Habit[];
  tasks?: Task[];
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: number;
  user_id: number;
  goal_id: number | null;
  title: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target_count: number;
  is_active: boolean;
  goal?: Goal;
  logs?: HabitLog[];
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  user_id: number;
  goal_id: number | null;
  title: string;
  description: string | null;
  status: 'todo' | 'doing' | 'done';
  is_urgent: boolean;
  is_important: boolean;
  due_date: string | null;
  goal?: Goal;
  created_at: string;
  updated_at: string;
}

// Tipos para formularios (sin los campos que genera el backend)
export type CreateLifeAreaDto = Pick<LifeArea, 'name' | 'color'> & { icon?: string };
export type CreateGoalDto = Pick<Goal, 'life_area_id' | 'title' | 'specific' | 'measurable' | 'achievable_note' | 'relevant_note' | 'deadline'>;
export type CreateHabitDto = Pick<Habit, 'title' | 'frequency' | 'target_count'> & { goal_id?: number };
export type CreateTaskDto = Pick<Task, 'title' | 'is_urgent' | 'is_important'> & { goal_id?: number; description?: string; due_date?: string };

export type UpdateTaskDto = Partial<CreateTaskDto> & { status?: Task['status'] };
export type UpdateGoalDto = Partial<CreateGoalDto> & { status?: Goal['status'] };