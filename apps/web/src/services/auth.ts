import api from '@/lib/api';
import { User } from '@/types';

export const authService = {
  async register(email: string, password: string, name?: string): Promise<User> {
    const response = await api.post('/api/auth/register', { email, password, name });
    return response.data;
  },

  async login(email: string, password: string): Promise<User> {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  getGoogleAuthUrl(): string {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/google`;
  },

  getFacebookAuthUrl(): string {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/facebook`;
  },
};
