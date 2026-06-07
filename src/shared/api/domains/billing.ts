import { z } from 'zod';
import { api, unwrapArray, unwrapObject, validateResponse } from '../base';
import { SubscriptionSchema, SubscriptionPlanSchema } from '@/entities/subscription';
import type { Subscription, SubscriptionPlan } from '@/entities/subscription';
import type { PaymentProvidersResponse, PaymentIntent, PaymentHistoryResponse } from '../types';

export const subscriptionApi = {
  getAll: async (): Promise<Subscription[]> => {
    const response = await api.get('/subscriptions');
    const data = unwrapArray<Subscription>(response.data, ['subscriptions', 'items', 'data']);
    return validateResponse(z.array(SubscriptionSchema), data);
  },
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get('/subscriptions/plans');
    const data = unwrapArray<SubscriptionPlan>(response.data, ['plans', 'items', 'data']);
    return validateResponse(z.array(SubscriptionPlanSchema), data);
  },
};

export const paymentsApi = {
  getProviders: async (): Promise<PaymentProvidersResponse> => {
    const response = await api.get('/payments/providers');
    const providers = unwrapArray<string>(response.data, ['providers', 'items', 'data']);
    return { providers };
  },
  createIntent: async (data: {
    provider: string;
    planId: number;
    paymentMethod?: string | null;
  }) => {
    const idempotencyKey =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const response = await api.post('/payments/intents', data, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return response.data;
  },
  checkIntent: async (intentId: string): Promise<PaymentIntent> => {
    const response = await api.get(`/payments/intents/${intentId}/check`);
    return response.data;
  },
  cancelIntent: async (intentId: string): Promise<PaymentIntent> => {
    const response = await api.post(`/payments/intents/${intentId}/cancel`);
    return response.data;
  },
  getHistory: async (cursor?: string | null, take = 20): Promise<PaymentHistoryResponse> => {
    const response = await api.get('/payments/history', {
      params: {
        ...(cursor ? { cursor } : {}),
        take,
      },
    });
    return unwrapObject(response.data, { items: [], nextCursor: null });
  },
};
