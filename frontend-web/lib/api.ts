import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/onboarding';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// API functions
export const api = {
  // Auth
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
  getMe: () => apiClient.get('/auth/me'),

  // Bills
  getBillsFeed: (params?: any) => apiClient.get('/bills/feed', { params }),
  getBillById: (billId: string) => apiClient.get(`/bills/${billId}`),
  voteBill: (billId: string, voteType: string) => apiClient.post(`/bills/${billId}/vote`, { voteType }),
  saveBill: (billId: string) => apiClient.post(`/bills/${billId}/save`),
  unsaveBill: (billId: string) => apiClient.delete(`/bills/${billId}/save`),

  // Amendments
  createAmendment: (billId: string, content: string) => apiClient.post(`/bills/${billId}/amendments`, { content }),
  getAmendments: (billId: string) => apiClient.get(`/bills/${billId}/amendments`),
  voteAmendment: (amendmentId: string, voteType: string) => apiClient.post(`/amendments/${amendmentId}/vote`, { voteType }),

  // Notifications
  getNotifications: () => apiClient.get('/notifications'),
  markAsRead: (notificationIds?: string[]) => apiClient.post('/notifications/mark-read', { notificationIds }),

  // User
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data: any) => apiClient.put('/user/profile', data),
};
