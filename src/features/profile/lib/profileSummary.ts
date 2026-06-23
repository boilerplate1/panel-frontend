import type { SubscriptionResponse } from '@/shared/api';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const EXPIRING_SOON_DAYS = 5;

export type SubscriptionState = 'active' | 'expiring' | 'inactive';

export function getSubscriptionDaysLeft(subscription: SubscriptionResponse | null) {
  if (!subscription?.expiresAt) return null;

  const expiresAt = new Date(subscription.expiresAt).getTime();
  if (Number.isNaN(expiresAt)) return null;

  return Math.max(0, Math.ceil((expiresAt - Date.now()) / MS_PER_DAY));
}

export function getSubscriptionState(subscription: SubscriptionResponse | null): SubscriptionState {
  if (!subscription) return 'inactive';

  const daysLeft = getSubscriptionDaysLeft(subscription);
  if (daysLeft !== null && daysLeft <= EXPIRING_SOON_DAYS) return 'expiring';

  return 'active';
}
