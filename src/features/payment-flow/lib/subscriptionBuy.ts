import type { SubscriptionPlanResponse, SubscriptionResponse } from '@/shared/api/generated';

export const DEFAULT_PAYMENT_PROVIDER = 'yookassa';
export const CREATING_PAYMENT_DELAY_MS = 450;

export function waitForCreatingState() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, CREATING_PAYMENT_DELAY_MS);
  });
}

export function getPositiveRoutePlanId(planId?: string | null) {
  const parsedPlanId = Number(planId);
  return Number.isFinite(parsedPlanId) && parsedPlanId > 0 ? parsedPlanId : null;
}

export function getSelectedProvider(provider?: string | null) {
  return (provider ?? DEFAULT_PAYMENT_PROVIDER).toLowerCase();
}

export function getActiveSubscription(subscriptions?: SubscriptionResponse[]) {
  return subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;
}

export function getSelectedPlan(
  plans: SubscriptionPlanResponse[] | undefined,
  selectedPlanId: number | null,
  routePlanId: number | null,
  activePaymentPlanId?: number,
) {
  const effectivePlanId =
    selectedPlanId ?? routePlanId ?? activePaymentPlanId ?? plans?.[0]?.id ?? null;
  return plans?.find((plan) => plan.id === effectivePlanId) ?? plans?.[0] ?? null;
}

export function getBestValuePlanId(plans?: SubscriptionPlanResponse[]) {
  if (!plans || plans.length <= 1) return null;

  return plans.reduce((best, plan) => {
    const bestDailyPrice = best.priceCents / Math.max(1, best.durationDays);
    const planDailyPrice = plan.priceCents / Math.max(1, plan.durationDays);

    if (planDailyPrice < bestDailyPrice) return plan;
    if (planDailyPrice === bestDailyPrice && plan.durationDays > best.durationDays) return plan;

    return best;
  }).id;
}

export function getRenewalExpiryDate(
  selectedPlan: SubscriptionPlanResponse | null,
  activeSubscription: SubscriptionResponse | null,
) {
  if (!selectedPlan) return null;

  try {
    const parsedExpiry = activeSubscription?.expiresAt
      ? new Date(activeSubscription.expiresAt).getTime()
      : null;
    const now = new Date();
    const baseDate =
      parsedExpiry && !Number.isNaN(parsedExpiry)
        ? new Date(Math.max(now.getTime(), parsedExpiry))
        : now;

    return new Date(baseDate.getTime() + selectedPlan.durationDays * 24 * 60 * 60 * 1000);
  } catch {
    return null;
  }
}
