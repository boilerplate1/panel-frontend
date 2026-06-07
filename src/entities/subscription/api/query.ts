import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '@/shared/api';
import type { Subscription, SubscriptionPlan } from '../model/types';

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  plans: ['subscriptions', 'plans'] as const,
};

export function useSubscriptionsQuery(enabled: boolean) {
  return useQuery<Subscription[]>({
    queryKey: subscriptionKeys.all,
    queryFn: subscriptionApi.getAll,
    enabled,
    staleTime: 30_000,
  });
}

export function useSubscriptionPlansQuery(enabled = true) {
  return useQuery<SubscriptionPlan[]>({
    queryKey: subscriptionKeys.plans,
    queryFn: subscriptionApi.getPlans,
    enabled,
    staleTime: 60_000,
  });
}
