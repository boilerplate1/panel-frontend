import { useTranslation } from 'react-i18next';
import {
  formatCurrency,
  formatDate,
  getPaymentAmountPrefix,
  getPaymentStatusLabel,
} from '@/shared/lib';
import type { PaymentHistoryItem } from '@/shared/api/generated';
import { Badge } from '@/shared/ui';
import styles from './TransactionItem.module.css';

interface TransactionItemProps {
  transaction: PaymentHistoryItem;
  locale: 'ru-RU' | 'en-US';
  onOpenDetail: (id: string) => void;
}

export function TransactionItem({ transaction, locale, onOpenDetail }: TransactionItemProps) {
  const { t } = useTranslation();

  const statusLabel = getPaymentStatusLabel(transaction.status, t);
  const amountPrefix = getPaymentAmountPrefix(transaction.status);
  const normalizedStatus = transaction.status.toLowerCase();
  const statusVariant =
    normalizedStatus === 'paid'
      ? 'success'
      : normalizedStatus === 'failed' ||
          normalizedStatus === 'canceled' ||
          normalizedStatus === 'expired'
        ? 'danger'
        : 'neutral';

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
          <span className={styles.itemAmount}>
            {amountPrefix}
            {formatCurrency(transaction.amountCents, transaction.currency, locale)}
          </span>
        </div>
        <div className={styles.itemBottomRow}>
          <div className={styles.itemLeft}>
            <Badge variant={statusVariant} className={styles.statusBadge}>
              {statusLabel}
            </Badge>
          </div>
          <span className={styles.itemDate}>{formatDate(transaction.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}
