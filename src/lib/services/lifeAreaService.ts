import api from '@/lib/api';
import type { LifeArea, CreateLifeAreaDto } from '@/types';

export const lifeAreaService = {
  async getAll(): Promise<LifeArea[]> {
    const response = await api.get<LifeArea[]>('/life-areas');
    return response.data;
  },

  async getOne(id: number): Promise<LifeArea> {
    const response = await api.get<LifeArea>(`/life-areas/${id}`);
    return response.data;
  },

  async create(data: CreateLifeAreaDto): Promise<LifeArea> {
    const response = await api.post<LifeArea>('/life-areas', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateLifeAreaDto>): Promise<LifeArea> {
    const response = await api.put<LifeArea>(`/life-areas/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/life-areas/${id}`);
  },
};