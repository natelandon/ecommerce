import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_SIMULATED_DELAY_MS } from '../lib/constants';
import { logger } from '../lib/logger';

export type User = {
  id: string;
  email: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  createdAt: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
};

// Mock user database (in real app, this would be backend API)
const mockUsers = new Map<string, { password: string; user: User }>();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) =>
          setTimeout(resolve, AUTH_SIMULATED_DELAY_MS),
        );

        const userData = mockUsers.get(email);
        if (userData && userData.password === password) {
          logger.info('User login successful', { email });
          set({ user: userData.user, isAuthenticated: true });
          return true;
        }
        logger.warn('Login failed - invalid credentials', { email });
        return false;
      },

      signup: async (email: string, password: string, name: string) => {
        // Simulate API call delay
        await new Promise((resolve) =>
          setTimeout(resolve, AUTH_SIMULATED_DELAY_MS),
        );

        // Check if user already exists
        if (mockUsers.has(email)) {
          logger.warn('Signup failed - user already exists', { email });
          return false;
        }

        const newUser: User = {
          id: Math.random().toString(36).substring(7),
          email,
          name,
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
          phone: '',
          createdAt: new Date().toISOString(),
        };

        mockUsers.set(email, { password, user: newUser });
        logger.info('User signup successful', { email });
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
