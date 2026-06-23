import type { SubscriptionPlanResponse } from './subscriptionPlanResponse';

export interface DeviceAvailability {
  limit: number;
  used: number;
  remaining: number;
  isFull: boolean;
}

export interface SubscriptionResponse {
  id: number;
  planId: number;
  remnaUserId: string;
  remnaSubLink: string;
  shortId: string;
  authKey: string;
  trafficTotal: string;
  trafficUsed: string;
  expiresAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  plan?: SubscriptionPlanResponse;
  deviceAvailability?: DeviceAvailability;
  remnaSquads?: unknown[];
}
