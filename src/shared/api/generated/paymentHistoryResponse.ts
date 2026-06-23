export interface PaymentHistoryItem {
  id: string;
  provider: string;
  status: string;
  amountCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  planId?: number | null;
  planName?: string | null;
  providerPaymentId?: string | null;
  providerInvoiceUrl?: string | null;
  creditedAt?: string | null;
  expiresAt?: string | null;
  lastError?: string | null;
}

export interface PaymentHistoryResponse {
  items: PaymentHistoryItem[];
  nextCursor?: string | null;
}
