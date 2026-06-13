import { useQuery } from '@tanstack/react-query';
import { systemApi } from '../domains/system';

export const systemKeys = {
  health: ['system', 'health'] as const,
};

export function useBackendHealthQuery() {
  return useQuery({
    queryKey: systemKeys.health,
    queryFn: systemApi.checkHealth,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
