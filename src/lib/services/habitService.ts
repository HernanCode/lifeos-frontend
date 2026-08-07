import api from '@/lib/api';
import type { Habit, HabitLog, CreateHabitDto } from '@/types';

export const habitService = {
  async getAll(): Promise<Habit[]> {
    const response = await api.get<Habit[]>('/habits');
    return response.data;
  },

  async create(data: CreateHabitDto): Promise<Habit> {
    const response = await api.post<Habit>('/habits', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateHabitDto> & { is_active?: boolean }): Promise<Habit> {
    const response = await api.put<Habit>(`/habits/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/habits/${id}`);
  },

  async toggle(id: number, completed: boolean, date?: string): Promise<HabitLog> {
    const response = await api.post<HabitLog>(`/habits/${id}/toggle`, {
      completed,
      date: date ?? new Date().toISOString().split('T')[0],
    });
    return response.data;
  },

  async getStreak(id: number): Promise<number> {
    const response = await api.get<{ streak: number }>(`/habits/${id}/streak`);
    return response.data.streak;
  },
};