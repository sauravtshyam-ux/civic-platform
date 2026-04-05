import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';
import { User } from '../types';
import { DEV_BYPASS_AUTH, DEV_USER } from '../config/dev';


interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    zipCode?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (DEV_BYPASS_AUTH) {
    AsyncStorage.removeItem('authToken');

    // ✅ Bypass auth for UI work
    setUser(DEV_USER as unknown as User);
    setToken('dev-token');
    setLoading(false);
    return;
  }

  loadStoredAuth();
}, []);


  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        const response = await authApi.getMe();
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
      await AsyncStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      setUser(response.data.user);
      setToken(response.data.token);
      await AsyncStorage.setItem('authToken', response.data.token);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    zipCode?: string;
  }) => {
    try {
      const response = await authApi.register(data);
      setUser(response.data.user);
      setToken(response.data.token);
      await AsyncStorage.setItem('authToken', response.data.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
