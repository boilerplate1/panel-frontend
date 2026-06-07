import { useQuery } from '@tanstack/react-query';
import { authApi } from '../domains/auth';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export function useMeQuery(enabled: boolean) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.getMe,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
