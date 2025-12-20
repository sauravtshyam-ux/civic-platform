'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  zipCode?: string;
  district?: string;
  state?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await api.getMe();
        setUser(response.data.data.user);
      }
    } catch (error) {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    const { user, token } = response.data.data;
    localStorage.setItem('authToken', token);
    setUser(user);
    return user;
  };

  const register = async (data: any) => {
    const response = await api.register(data);
    const { user, token } = response.data.data;
    localStorage.setItem('authToken', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    window.location.href = '/onboarding';
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
};
