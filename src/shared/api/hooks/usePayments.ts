import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { billingService } from '../services';
import type {
  CreatePaymentIntentRequest,
  PaymentHistoryResponse,
  PaymentIntentResponse,
  PaymentProvidersResponse,
} from '../generated';

export const paymentKeys = {
  providers: ['payments', 'providers'] as const,
  history: ['payments', 'history'] as const,
  historyPage: (page: number) => ['payments', 'history', 'page', page] as const,
  intent: (id: string) => ['payments', 'intent', id] as const,
};

export function usePaymentProvidersQuery() {
  return useQuery<PaymentProvidersResponse>({
    queryKey: paymentKeys.providers,
    queryFn: billingService.getProviders,
    staleTime: 5 * 60_000,
  });
}

export function useCreatePaymentIntentMutation() {
  return useMutation<PaymentIntentResponse, Error, CreatePaymentIntentRequest>({
    mutationFn: billingService.createIntent,
  });
}

export function useCheckPaymentIntentQuery(intentId: string | null, enabled = true) {
  return useQuery<PaymentIntentResponse>({
    queryKey: paymentKeys.intent(intentId as string),
    queryFn: () => billingService.checkIntent(intentId as string),
    enabled: enabled && !!intentId,
    staleTime: 0,
    retry: false,
  });
}

export function useCancelPaymentIntentMutation() {
  return useMutation<PaymentIntentResponse, Error, string>({
    mutationFn: billingService.cancelIntent,
  });
}

export function usePaymentHistoryInfiniteQuery(enabled: boolean) {
  return useInfiniteQuery<PaymentHistoryResponse>({
    queryKey: paymentKeys.history,
    queryFn: ({ pageParam }) => billingService.getHistory(pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    enabled,
    staleTime: 30_000,
  });
}

export function usePaymentHistoryPageQuery(enabled: boolean, page: number) {
  return useQuery<PaymentHistoryResponse>({
    queryKey: paymentKeys.historyPage(page),
    queryFn: () => billingService.getHistoryPage(page),
    enabled,
    staleTime: 30_000,
  });
}
