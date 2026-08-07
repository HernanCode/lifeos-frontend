import api from '@/lib/api';
import type { User } from '@/types';

interface AuthResponse {
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
  },

  async me(): Promise<User> {
    const response = await api.get<User>('/me');
    return response.data;
  },
};