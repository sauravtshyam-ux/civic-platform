import apiClient from './client';
import { Notification } from '../types';

export const notificationsApi = {
  getNotifications: async (): Promise<{
    success: boolean;
    data: { notifications: Notification[]; unreadCount: number };
  }> => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  markAsRead: async (notificationIds?: string[]) => {
    const response = await apiClient.post('/notifications/mark-read', {
      notificationIds,
    });
    return response.data;
  },
};
