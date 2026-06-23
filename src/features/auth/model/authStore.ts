import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/shared/api';
import {
  clearAuthSession,
  saveAuthSession,
  getStoredToken,
  getStoredUser,
  queryClient,
} from '@/shared/lib';
import { usePaymentStore } from '@/features/payment-management';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  actions: {
    login: (token: string, user: User) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: getStoredUser(),
      accessToken: getStoredToken(),
      isAuthenticated: !!getStoredToken() && !!getStoredUser(),
      isLoading: false,

      actions: {
        login: (token, user) => {
          usePaymentStore.getState().reset();
          queryClient.clear();

          saveAuthSession(token, user);
          set({
            accessToken: token,
            user,
            isAuthenticated: true,
          });
        },
        logout: () => {
          usePaymentStore.getState().reset();
          queryClient.clear();
          clearAuthSession();
          set({
            accessToken: null,
            user: null,
            isAuthenticated: false,
          });
        },
        setUser: (user) => set({ user, isAuthenticated: !!user && !!get().accessToken }),
        setLoading: (isLoading) => set({ isLoading }),
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const useAuthUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthActions = () => useAuthStore((s) => s.actions);
