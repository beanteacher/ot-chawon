import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthDto } from '@/types/auth.dto';

interface AuthState {
  user: AuthDto.UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthDto.UserProfile, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
