import { z } from 'zod';

export const SubscriptionPlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  label: z.string().optional(),
  priceCents: z.number(),
  durationDays: z.number(),
  trafficLimitGb: z.number(),
  maxDevices: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  currency: z.string().optional(),
});

export const SubscriptionSchema = z.object({
  id: z.number(),
  planId: z.number(),
  remnaUserId: z.string(),
  remnaSubLink: z.string(),
  shortId: z.string(),
  authKey: z.string(),
  trafficTotal: z.string(),
  trafficUsed: z.string(),
  expiresAt: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  plan: SubscriptionPlanSchema.optional(),
  deviceAvailability: z
    .object({
      limit: z.number(),
      used: z.number(),
      remaining: z.number(),
      isFull: z.boolean(),
    })
    .optional(),
  remnaSquads: z.array(z.unknown()).optional(),
});

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
