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
      const rawProviders = unwrapArray<string | { id?: string; name?: string; methods?: string[] }>(
        r.data,
        ['providers', 'items', 'data'],
      );
      const providers: string[] = [];
      const methods: Record<string, string[]> = {};

      rawProviders.forEach((provider) => {
        if (typeof provider === 'string') {
          providers.push(provider);
          return;
        }

        const id = provider.id ?? provider.name;
        if (!id) return;

        providers.push(id);
        if (Array.isArray(provider.methods)) {
          methods[id.toLowerCase()] = provider.methods;
        }
      });

      const responseMethods =
        r.data && typeof r.data === 'object' && 'methods' in r.data ? r.data.methods : undefined;

      if (responseMethods && typeof responseMethods === 'object') {
        Object.entries(responseMethods as Record<string, unknown>).forEach(([provider, value]) => {
          if (Array.isArray(value)) {
            methods[provider.toLowerCase()] = value.filter(
              (method): method is string => typeof method === 'string',
            );
          }
        });
      }

      return { providers, methods };
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

  getHistoryPage(page = 1, take = 20): Promise<PaymentHistoryResponse> {
    return apiClient
      .get('/payments/history', {
        params: { page, take },
      })
      .then((r) => unwrapObject(r.data, { items: [], total: 0, page: 1, totalPages: 0 }));
  }
}
