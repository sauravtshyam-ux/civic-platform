import apiClient from './client';
import { Bill, Amendment } from '../types';

export const billsApi = {
  getFeed: async (params?: {
    state?: string;
    district?: string;
    page?: number;
    limit?: number;
    level?: 'federal' | 'state';
  }) => {
    const response = await apiClient.get('/bills/feed', { params });
    return response.data;
  },

  getBillById: async (billId: string): Promise<{ success: boolean; data: { bill: Bill & { amendments: Amendment[] } } }> => {
    const response = await apiClient.get(`/bills/${billId}`);
    return response.data;
  },

  voteBill: async (billId: string, voteType: 'upvote' | 'downvote') => {
    const response = await apiClient.post(`/bills/${billId}/vote`, { voteType });
    return response.data;
  },

  saveBill: async (billId: string) => {
    const response = await apiClient.post(`/bills/${billId}/save`);
    return response.data;
  },

  unsaveBill: async (billId: string) => {
    const response = await apiClient.delete(`/bills/${billId}/save`);
    return response.data;
  },

  createAmendment: async (billId: string, content: string) => {
    const response = await apiClient.post(`/bills/${billId}/amendments`, { content });
    return response.data;
  },

  getAmendments: async (billId: string) => {
    const response = await apiClient.get(`/bills/${billId}/amendments`);
    return response.data;
  },

  voteAmendment: async (amendmentId: string, voteType: 'upvote' | 'downvote') => {
    const response = await apiClient.post(`/amendments/${amendmentId}/vote`, { voteType });
    return response.data;
  },
};
