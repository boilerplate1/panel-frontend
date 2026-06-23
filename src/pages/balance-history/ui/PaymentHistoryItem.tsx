import { useTranslation } from 'react-i18next';
import { usePaymentHistoryPageQuery } from '@/features/payment-management'; // Импортируем хук страницы
import {
  formatCurrency,
  formatDate,
  getPaymentAmountClass,
  getPaymentAmountPrefix,
  getPaymentProviderIcon,
  getPaymentProviderLabel,
  getPaymentStatusLabel,
} from '@/shared/lib';
import styles from './BalanceHistoryPage.module.css';

type PaymentHistoryItemType = NonNullable<
  ReturnType<typeof usePaymentHistoryPageQuery>['data']
>['items'][number];

interface PaymentHistoryItemProps {
  item: PaymentHistoryItemType; 
  locale: 'ru-RU' | 'en-US';
  onOpenDetail: (id: string) => void;
}

export function PaymentHistoryItem({ item, locale, onOpenDetail }: PaymentHistoryItemProps) {
  const { t } = useTranslation();

  const providerIcon = getPaymentProviderIcon(item.provider);
  const providerLabel = getPaymentProviderLabel(item.provider);
  const statusLabel = getPaymentStatusLabel(item.status, t);
  const amountClass = getPaymentAmountClass(item.status, styles);
  const amountPrefix = getPaymentAmountPrefix(item.status);

  return (
    <button
      type="button"
      className={`${styles.item} stagger-item`}
      onClick={() => onOpenDetail(item.id)}
    >
      <div className={styles.itemInfo}>
        <div className={styles.itemTopRow}>
          <div className={styles.itemName}>
            {item.planName ?? t('dashboard.subscriptions')}
          </div>
          <span className={`${styles.itemAmount} ${amountClass}`}>
            {amountPrefix}
            {formatCurrency(item.amountCents, item.currency, locale)}
          </span>
        </div>
        <div className={styles.itemBottomRow}>
          <div className={styles.itemLeft}>
            <span className={styles.statusLabel}>{statusLabel}</span>
            {providerIcon && (
              <span className={styles.providerRow}>
                <img
                  src={providerIcon as string}
                  alt={providerLabel}
                  className={styles.providerIcon}
                />
                <span className={styles.providerText}>{providerLabel}</span>
              </span>
            )}
          </div>
          <span className={styles.itemDate}>{formatDate(item.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}