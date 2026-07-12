import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { billingService } from '../services';
import type { SubscriptionResponse, SubscriptionPlanResponse } from '../generated';

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  plans: ['subscriptions', 'plans'] as const,
};

export function useSubscriptionsQuery(enabled: boolean) {
  return useQuery<SubscriptionResponse[]>({
    queryKey: subscriptionKeys.all,
    queryFn: billingService.getSubscriptions,
    enabled,
    staleTime: 30_000,
  });
}

export function useSubscriptionsSuspenseQuery() {
  return useSuspenseQuery<SubscriptionResponse[]>({
    queryKey: subscriptionKeys.all,
    queryFn: billingService.getSubscriptions,
    staleTime: 30_000,
  });
}

export function useSubscriptionPlansQuery(enabled = true) {
  return useQuery<SubscriptionPlanResponse[]>({
    queryKey: subscriptionKeys.plans,
    queryFn: billingService.getPlans,
    enabled,
    staleTime: 60_000,
  });
}

export function useSubscriptionPlansSuspenseQuery() {
  return useSuspenseQuery<SubscriptionPlanResponse[]>({
    queryKey: subscriptionKeys.plans,
    queryFn: billingService.getPlans,
    staleTime: 60_000,
  });
}
