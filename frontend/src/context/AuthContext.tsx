import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from localStorage or verify token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('darukaa_access_token');
      const storedUser = localStorage.getItem('darukaa_user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Re-verify with backend
          const me = await authService.getMe();
          setUser(me);
          localStorage.setItem('darukaa_user', JSON.stringify(me));
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          authService.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    localStorage.setItem('darukaa_access_token', data.tokens.access_token);
    localStorage.setItem('darukaa_refresh_token', data.tokens.refresh_token);
    localStorage.setItem('darukaa_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login(email, password);
    handleAuthSuccess(data);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await authService.register(name, email, password);
    handleAuthSuccess(data);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
