import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services';
import type { AuthResponse } from '../generated';
import { saveAuthSession, queryClient } from '@/shared/lib';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: authService.loginWeb,
    onSuccess: (data: AuthResponse) => {
      saveAuthSession(data.accessToken, data.user);
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data: AuthResponse) => {
      saveAuthSession(data.accessToken, data.user);
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: authService.logout,
  });
}

export function useAuthMeQuery(enabled: boolean) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authService.getMe,
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
