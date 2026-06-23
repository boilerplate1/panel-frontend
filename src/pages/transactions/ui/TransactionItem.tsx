import { useTranslation } from 'react-i18next';
import { usePaymentHistoryPageQuery } from '@/features/payment-management';
import {
  formatCurrency,
  formatDate,
  getPaymentAmountClass,
  getPaymentAmountPrefix,
  getPaymentProviderIcon,
  getPaymentProviderLabel,
  getPaymentStatusLabel,
} from '@/shared/lib';
import styles from './TransactionItem.module.css';

type TransactionItemType = NonNullable<
  ReturnType<typeof usePaymentHistoryPageQuery>['data']
>['items'][number];

interface TransactionItemProps {
  transaction: TransactionItemType;
  locale: 'ru-RU' | 'en-US';
  onOpenDetail: (id: string) => void;
}

export function TransactionItem({ transaction, locale, onOpenDetail }: TransactionItemProps) {
  const { t } = useTranslation();

  const providerIcon = getPaymentProviderIcon(transaction.provider);
  const providerLabel = getPaymentProviderLabel(transaction.provider);
  const statusLabel = getPaymentStatusLabel(transaction.status, t);
  const amountClass = getPaymentAmountClass(transaction.status, styles);
  const amountPrefix = getPaymentAmountPrefix(transaction.status);

  return (
    <button
      type="button"
      className={`${styles.item} stagger-item`}
      onClick={() => onOpenDetail(transaction.id)}
    >
      <div className={styles.itemInfo}>
        <div className={styles.itemTopRow}>
          <div className={styles.itemName}>
            {transaction.planName ?? t('dashboard.subscriptions')}
          </div>
          <span className={`${styles.itemAmount} ${amountClass}`}>
            {amountPrefix}
            {formatCurrency(transaction.amountCents, transaction.currency, locale)}
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
          <span className={styles.itemDate}>{formatDate(transaction.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}
