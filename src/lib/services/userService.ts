import api from '@/lib/api';
import type { User } from '@/types';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/user');
    return response.data;
  },

  async updateProfile(data: { name: string }): Promise<User> {
    const response = await api.put<User>('/user', data);
    return response.data;
  },
};
