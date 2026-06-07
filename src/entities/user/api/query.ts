import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import type { User } from '../model/types';

export const userKeys = {
  me: ['user', 'me'] as const,
};

export function useAuthMeQuery(enabled: boolean) {
  return useQuery<User>({
    queryKey: userKeys.me,
    queryFn: authApi.getMe,
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
