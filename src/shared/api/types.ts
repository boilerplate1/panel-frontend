import type { User } from '@/entities/user';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface PairingInitResponse {
  id: string;
  shortCode?: string | null;
}

export interface PairingStatusResponse {
  status: string;
}

export interface PaymentProvidersResponse {
  providers: string[];
}

export interface PaymentIntent {
  id: string;
  planId?: number;
  provider: string;
  status: string;
  providerInvoiceUrl?: string | null;
}

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

export interface ClientSettings {
  flags: {
    allowRegistration: boolean;
  };
}

export type ExternalPaymentStatus =
  | 'pending'
  | 'requires_action'
  | 'paid'
  | 'failed'
  | 'canceled'
  | 'expired'
  | 'ignored';

export const YOOKASSA_PAYMENT_METHODS = ['bank_card', 'sbp', 'yoo_money'] as const;
export type YookassaPaymentMethod = (typeof YOOKASSA_PAYMENT_METHODS)[number];

