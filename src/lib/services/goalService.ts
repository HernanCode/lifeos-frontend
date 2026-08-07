import api from '@/lib/api';
import type { Goal, CreateGoalDto, UpdateGoalDto } from '@/types';

export const goalService = {
  async getAll(): Promise<Goal[]> {
    const response = await api.get<Goal[]>('/goals');
    return response.data;
  },

  async getOne(id: number): Promise<Goal> {
    const response = await api.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  async create(data: CreateGoalDto): Promise<Goal> {
    const response = await api.post<Goal>('/goals', data);
    return response.data;
  },

  async update(id: number, data: UpdateGoalDto): Promise<Goal> {
    const response = await api.put<Goal>(`/goals/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
};