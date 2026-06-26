import { create } from 'zustand';
import type { User } from '@/shared/api';
import {
  clearAuthSession,
  saveAuthSession,
  getStoredToken,
  getStoredUser,
  queryClient,
} from '@/shared/lib';
import { usePaymentStore } from '@/features/payment-flow/model/paymentStore';

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

export const useAuthStore = create<AuthState>()((set, get) => {
  const storedToken = getStoredToken();
  const storedUser = getStoredUser();

  return {
    user: storedUser,
    accessToken: storedToken,
    isAuthenticated: !!storedToken && !!storedUser,
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
  };
});

export const useAuth = () => {
  const { user, accessToken, isAuthenticated, isLoading, actions } = useAuthStore();
  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login: actions.login,
    logout: actions.logout,
  };
};

export const useAuthUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthActions = () => useAuthStore((s) => s.actions);
