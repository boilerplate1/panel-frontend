import { CreditCard, Bitcoin, Globe, Smartphone, type LucideIcon } from 'lucide-react';

export const PAYMENT_METHOD_ICONS: Record<string, LucideIcon> = {
  bank_card: CreditCard,
  sbp: Smartphone,
  yoo_money: Globe,
  cryptopay: Bitcoin,
  default: CreditCard,
};

export const YOOKASSA_PAYMENT_METHODS = ['bank_card', 'sbp', 'yoo_money'] as const;
export type YookassaPaymentMethod = (typeof YOOKASSA_PAYMENT_METHODS)[number];
