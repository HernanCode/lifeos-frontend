import api from '@/lib/api';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

export const taskService = {
  async getAll(filters?: { status?: string; is_urgent?: boolean; is_important?: boolean }): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks', { params: filters });
    return response.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};