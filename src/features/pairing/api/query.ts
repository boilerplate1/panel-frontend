import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import type { PairingInitResponse, PairingStatusResponse } from '@/shared/api';

export const pairingKeys = {
  all: ['pairing'] as const,
  init: ['pairing', 'init'] as const,
  status: (id: string) => ['pairing', 'status', id] as const,
};

export function usePairingInitQuery(enabled: boolean) {
  return useQuery<PairingInitResponse>({
    queryKey: pairingKeys.init,
    queryFn: authApi.initPairing,
    enabled,
    staleTime: Infinity,
    retry: false,
  });
}

export function usePairingStatusQuery(sessionId: string | null) {
  return useQuery<PairingStatusResponse>({
    queryKey: pairingKeys.status(sessionId as string),
    queryFn: () => authApi.checkPairingStatus(sessionId as string),
    enabled: !!sessionId,
    refetchInterval: (query) => (query.state.data?.status === 'confirmed' ? false : 2000),
    refetchIntervalInBackground: true,
    retry: false,
  });
}
