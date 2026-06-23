import { useTranslation } from 'react-i18next';
import { ResponsiveModal, Button } from '@/shared/ui';
import {
  formatCurrency,
  formatDate,
  getPaymentProviderIcon,
  getPaymentProviderLabel,
  getPaymentStatusLabel,
} from '@/shared/lib';
import type { PaymentHistoryItem } from '@/shared/api/generated';
import styles from './TransactionDetailModal.module.css';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentHistoryItem | null;
  locale: 'ru-RU' | 'en-US';
}

export function TransactionDetailModal({ isOpen, onClose, transaction, locale }: TransactionDetailModalProps) {
  const { t } = useTranslation();

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction?.planName ?? t('dashboard.subscriptions')}
    >
      {transaction ? (
        <div className={styles.modalGrid}>
          <div className={styles.modalRow}>
            <span>{t('dashboard.history_provider')}</span>
            <strong className={styles.modalProviderValue}>
              {getPaymentProviderIcon(transaction.provider) ? (
                <img
                  src={getPaymentProviderIcon(transaction.provider)}
                  alt={getPaymentProviderLabel(transaction.provider)}
                  className={styles.modalProviderIcon}
                />
              ) : null}
              <span>{getPaymentProviderLabel(transaction.provider)}</span>
            </strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_amount')}</span>
            <strong>
              {formatCurrency(transaction.amountCents, transaction.currency, locale)}
            </strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_status')}</span>
            <strong className={styles.modalStatusValue}>
              {getPaymentStatusLabel(transaction.status, t)}
            </strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_plan_id')}</span>
            <strong>{transaction.planId ?? '-'}</strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_payment_id')}</span>
            <strong>{transaction.providerPaymentId ?? '-'}</strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_created')}</span>
            <strong>{formatDate(transaction.createdAt)}</strong>
          </div>

          <div className={`${styles.modalRow} ${styles.modalRowFullWide}`}>
            <span>{t('dashboard.history_updated')}</span>
            <strong>{formatDate(transaction.updatedAt)}</strong>
          </div>
          
          {transaction.lastError && (
            <div className={`${styles.modalError} ${styles.modalRowFullWide}`}>
              <span>{t('dashboard.history_error')}</span>
              <strong>{transaction.lastError}</strong>
            </div>
          )}
          
          {(transaction.providerInvoiceUrl || transaction.lastError) && (
            <div className={styles.modalSupportBlock}>
              {transaction.providerInvoiceUrl && (
                <Button
                  as="a"
                  href={transaction.providerInvoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalLink}
                  variant="outline"
                >
                  {t('dashboard.history_open_payment')}
                </Button>
              )}
              <div className={styles.modalSupportText}>
                {t('dashboard.history_payment_support_hint')}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className={styles.emptyText}>{t('dashboard.history_empty')}</p>
      )}
    </ResponsiveModal>
  );
}
