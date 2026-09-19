import { api } from './api';
import { AuthResponse, User } from '../types';
import { MockDataStore, DEMO_AUTH_RESPONSE, DEMO_USER } from './mockDataStore';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      return response.data;
    } catch (err: any) {
      // Graceful fallback for demo / sleeping Render backend
      console.warn('Backend unavailable, activating Interactive Demo Session:', err?.message);
      const demoResponse = {
        ...DEMO_AUTH_RESPONSE,
        user: {
          ...DEMO_USER,
          email: email || DEMO_USER.email,
        },
      };
      return demoResponse;
    }
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
        role: 'admin',
      });
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable during registration, activating Demo Session:', err?.message);
      const demoUser: User = {
        id: `usr_${Date.now()}`,
        name: name || 'Administrator',
        email: email || 'admin@darukaa.earth',
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      return {
        user: demoUser,
        tokens: DEMO_AUTH_RESPONSE.tokens,
      };
    }
  },

  async getMe(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (err: any) {
      const stored = localStorage.getItem('darukaa_user');
      if (stored) return JSON.parse(stored);
      return DEMO_USER;
    }
  },

  logout(): void {
    localStorage.removeItem('darukaa_access_token');
    localStorage.removeItem('darukaa_refresh_token');
    localStorage.removeItem('darukaa_user');
  },
};
