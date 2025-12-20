import apiClient from './client';
import { AuthResponse, User } from '../types';

export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    zipCode?: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; data: { user: User } }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
