import { useQuery } from '@tanstack/react-query';
import { systemApi } from '../domains/system';

export const systemKeys = {
  health: ['system', 'health'] as const,
  clientSettings: ['system', 'client-settings'] as const,
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

export function useClientSettingsQuery() {
  return useQuery({
    queryKey: systemKeys.clientSettings,
    queryFn: systemApi.getClientSettings,
    retry: false,
    staleTime: 60_000,
  });
}
