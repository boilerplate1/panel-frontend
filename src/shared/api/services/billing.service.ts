import { apiClient, unwrapArray, unwrapObject } from '../api-client';
import type {
  CreatePaymentIntentRequest,
  PaymentIntentResponse,
  PaymentProvidersResponse,
  PaymentHistoryResponse,
  SubscriptionPlanResponse,
  SubscriptionResponse,
} from '../generated';

export class BillingService {
  getSubscriptions(): Promise<SubscriptionResponse[]> {
    return apiClient
      .get('/subscriptions')
      .then((r) => unwrapArray<SubscriptionResponse>(r.data, ['subscriptions', 'items', 'data']));
  }

  getPlans(): Promise<SubscriptionPlanResponse[]> {
    return apiClient
      .get('/subscriptions/plans')
      .then((r) => unwrapArray<SubscriptionPlanResponse>(r.data, ['plans', 'items', 'data']));
  }

  getProviders(): Promise<PaymentProvidersResponse> {
    return apiClient.get('/payments/providers').then((r) => {
      const providers = unwrapArray<string>(r.data, ['providers', 'items', 'data']);
      return { providers };
    });
  }

  createIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    const idempotencyKey =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return apiClient
      .post('/payments/intents', data, {
        headers: { 'Idempotency-Key': idempotencyKey },
      })
      .then((r) => r.data);
  }

  checkIntent(intentId: string): Promise<PaymentIntentResponse> {
    return apiClient.get(`/payments/intents/${intentId}/check`).then((r) => r.data);
  }

  cancelIntent(intentId: string): Promise<PaymentIntentResponse> {
    return apiClient.post(`/payments/intents/${intentId}/cancel`).then((r) => r.data);
  }

  getHistory(cursor?: string | null, take = 20): Promise<PaymentHistoryResponse> {
    return apiClient
      .get('/payments/history', {
        params: {
          ...(cursor ? { cursor } : {}),
          take,
        },
      })
      .then((r) => unwrapObject(r.data, { items: [], nextCursor: null }));
  }
}
