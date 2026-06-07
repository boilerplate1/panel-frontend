import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/shared/api';
import type { PaymentHistoryResponse, PaymentIntent, PaymentProvidersResponse } from '@/shared/api';

export const paymentKeys = {
  providers: ['payments', 'providers'] as const,
  history: ['payments', 'history'] as const,
  intent: (id: string) => ['payments', 'intent', id] as const,
};

export function usePaymentProvidersQuery() {
  return useQuery<PaymentProvidersResponse>({
    queryKey: paymentKeys.providers,
    queryFn: paymentsApi.getProviders,
    staleTime: 5 * 60_000,
  });
}

export function useCreatePaymentIntentMutation() {
  return useMutation({
    mutationFn: paymentsApi.createIntent,
  });
}

export function useCheckPaymentIntentQuery(intentId: string | null) {
  return useQuery<PaymentIntent>({
    queryKey: paymentKeys.intent(intentId as string),
    queryFn: () => paymentsApi.checkIntent(intentId as string),
    enabled: !!intentId,
    staleTime: 0,
    retry: false,
  });
}

export function useCancelPaymentIntentMutation() {
  return useMutation({
    mutationFn: paymentsApi.cancelIntent,
  });
}

export function usePaymentHistoryInfiniteQuery(enabled: boolean) {
  return useInfiniteQuery<PaymentHistoryResponse>({
    queryKey: paymentKeys.history,
    queryFn: ({ pageParam }) => paymentsApi.getHistory(pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    enabled,
    staleTime: 30_000,
  });
}
