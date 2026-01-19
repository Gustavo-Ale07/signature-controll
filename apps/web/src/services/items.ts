import api from '@/lib/api';
import { Item, CreateItemInput, DashboardStats } from '@/types';

export const itemService = {
  async getAll(type?: string, search?: string): Promise<Item[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    
    const response = await api.get(`/api/items?${params}`);
    return response.data;
  },

  async getById(id: string): Promise<Item> {
    const response = await api.get(`/api/items/${id}`);
    return response.data;
  },

  async getSecret(id: string): Promise<{ password: string | null }> {
    const response = await api.get(`/api/items/${id}/secret`);
    return response.data;
  },

  async create(data: CreateItemInput): Promise<Item> {
    const formData = new FormData();
    
    formData.append('type', data.type);
    formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.password) formData.append('password', data.password);
    if (data.value !== undefined) formData.append('value', data.value.toString());
    if (data.billingDay) formData.append('billingDay', data.billingDay.toString());
    if (data.duration) formData.append('duration', data.duration);
    if (data.notes) formData.append('notes', data.notes);
    if (data.icon) formData.append('icon', data.icon);
    
    const response = await api.post('/api/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async update(id: string, data: Partial<CreateItemInput>): Promise<Item> {
    const formData = new FormData();
    
    if (data.type) formData.append('type', data.type);
    if (data.name) formData.append('name', data.name);
    if (data.email !== undefined) formData.append('email', data.email);
    if (data.password !== undefined) formData.append('password', data.password);
    if (data.value !== undefined) formData.append('value', data.value.toString());
    if (data.billingDay !== undefined) formData.append('billingDay', data.billingDay.toString());
    if (data.duration) formData.append('duration', data.duration);
    if (data.notes !== undefined) formData.append('notes', data.notes);
    if (data.icon) formData.append('icon', data.icon);
    
    const response = await api.patch(`/api/items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/items/${id}`);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/api/items/stats/dashboard');
    return response.data;
  },
};
