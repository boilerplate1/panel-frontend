export interface PaymentIntentResponse {
  id: string;
  planId?: number;
  provider: string;
  status: string;
  amountCents: number;
  currency: string;
  providerInvoiceUrl?: string | null;
  providerPaymentId?: string | null;
  lastError?: string | null;
  createdAt: string;
  expiresAt?: string | null;
  creditedAt?: string | null;
}
