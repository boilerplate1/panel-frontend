import { useQuery } from '@tanstack/react-query';
import { authService } from '../services';
import type { PairingInitResponse, PairingStatusResponse } from '../generated';

export const pairingKeys = {
  all: ['pairing'] as const,
  init: ['pairing', 'init'] as const,
  status: (id: string) => ['pairing', 'status', id] as const,
};

export function usePairingInitQuery(enabled: boolean) {
  return useQuery<PairingInitResponse>({
    queryKey: pairingKeys.init,
    queryFn: authService.initPairing,
    enabled,
    staleTime: Infinity,
    retry: false,
  });
}

export function usePairingStatusQuery(sessionId: string | null) {
  return useQuery<PairingStatusResponse>({
    queryKey: pairingKeys.status(sessionId as string),
    queryFn: () => authService.checkPairingStatus(sessionId as string),
    enabled: !!sessionId,
    refetchInterval: (query) => (query.state.data?.status === 'confirmed' ? false : 2000),
    refetchIntervalInBackground: true,
    retry: false,
  });
}
