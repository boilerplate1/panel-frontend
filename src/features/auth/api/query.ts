import { useMutation } from '@tanstack/react-query';
import { authApi, type AuthResponse } from '@/shared/api';
import { saveAuthSession, queryClient } from '@/shared/lib';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: authApi.loginWeb,
    onSuccess: (data: AuthResponse) => {
      saveAuthSession(data.accessToken, data.user);
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: AuthResponse) => {
      saveAuthSession(data.accessToken, data.user);
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: authApi.logout,
  });
}
