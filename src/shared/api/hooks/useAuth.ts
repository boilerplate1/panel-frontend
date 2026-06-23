import { useQuery } from '@tanstack/react-query';
import { authService } from '../services';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export function useAuthMeQuery(enabled: boolean) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authService.getMe,
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
