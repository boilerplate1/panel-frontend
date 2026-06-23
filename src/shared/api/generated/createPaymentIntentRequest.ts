export interface CreatePaymentIntentRequest {
  provider: string;
  planId: number;
  paymentMethod?: string | null;
}
