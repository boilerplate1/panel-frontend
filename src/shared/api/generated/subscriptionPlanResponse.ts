export interface SubscriptionPlanResponse {
  id: number;
  name: string;
  priceCents: number;
  label: string | null;
  durationDays: number;
  trafficLimitGb: number;
  maxDevices: number;
  isActive: boolean;
  currency?: string;
}
