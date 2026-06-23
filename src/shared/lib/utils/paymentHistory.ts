import { MirIcon, SbpIcon, YookassaIcon } from '@/shared/assets/icons';
import type { TFunction } from 'i18next';

export function getPaymentProviderLabel(provider: string) {
  if (provider === 'YOOKASSA') return 'YooKassa';
  if (provider === 'CRYPTOPAY') return 'CryptoPay';
  if (provider === 'SBP') return 'SBP';
  if (provider === 'MIR') return 'Mir';
  return provider;
}

export function getPaymentProviderIcon(provider: string) {
  const normalized = provider.toUpperCase();
  if (normalized === 'YOOKASSA') return YookassaIcon;
  if (normalized === 'SBP') return SbpIcon;
  if (normalized === 'MIR') return MirIcon;
  return null;
}

export function getPaymentStatusLabel(status: string, t: TFunction) {
  const normalized = status.toUpperCase();
  switch (normalized) {
    case 'PAID':
      return t('history.status_paid');
    case 'PENDING':
    case 'CREATED':
    case 'REQUIRES_ACTION':
      return t('history.status_pending');
    case 'FAILED':
      return t('history.status_failed');
    case 'CANCELED':
      return t('history.status_canceled');
    case 'EXPIRED':
      return t('history.status_expired');
    default:
      return normalized;
  }
}

export function getPaymentAmountPrefix(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === 'PAID') return '+';
  if (normalized === 'FAILED' || normalized === 'CANCELED' || normalized === 'EXPIRED') {
    return '-';
  }
  return '';
}

export function getPaymentAmountClass(status: string, stylesMap: Record<string, string>) {
  const normalized = status.toUpperCase();
  if (normalized === 'PAID') return stylesMap.amountPositive;
  if (normalized === 'FAILED' || normalized === 'CANCELED' || normalized === 'EXPIRED') {
    return stylesMap.amountNegative;
  }
  return stylesMap.amountNeutral;
}
