export interface CreatePaymentIntentRequest {
  provider: 'yookassa' | 'cryptopay';
  planId: number;
  paymentMethod?: 'bank_card' | 'sbp' | 'yoo_money';
}
