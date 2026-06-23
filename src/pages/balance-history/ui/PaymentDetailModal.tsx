import { useTranslation } from 'react-i18next';
import { ResponsiveModal, Button } from '@/shared/ui';
import { usePaymentHistoryPageQuery } from '@/features/payment-management';
import {
  formatCurrency,
  formatDate,
  getPaymentProviderIcon,
  getPaymentProviderLabel,
  getPaymentStatusLabel,
} from '@/shared/lib';
import styles from './BalanceHistoryPage.module.css';

type PaymentHistoryItemType = NonNullable<
  ReturnType<typeof usePaymentHistoryPageQuery>['data']
>['items'][number];

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: PaymentHistoryItemType | null; 
  locale: 'ru-RU' | 'en-US';
}

export function PaymentDetailModal({ isOpen, onClose, selectedItem, locale }: PaymentDetailModalProps) {
  const { t } = useTranslation();
console.log('Стили модалки:', styles);
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedItem?.planName ?? t('dashboard.subscriptions')}
    >
      {selectedItem ? (
        <div className={styles.modalGrid}>
          <div className={styles.modalRow}>
            <span>{t('dashboard.history_provider')}</span>
            <strong className={styles.modalProviderValue}>
              {getPaymentProviderIcon(selectedItem.provider) ? (
                <img
                  src={getPaymentProviderIcon(selectedItem.provider) as string}
                  alt={getPaymentProviderLabel(selectedItem.provider)}
                  className={styles.modalProviderIcon}
                />
              ) : null}
              <span>{getPaymentProviderLabel(selectedItem.provider)}</span>
            </strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_amount')}</span>
            <strong>
              {formatCurrency(selectedItem.amountCents, selectedItem.currency, locale)}
            </strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_status')}</span>
            <strong className={styles.modalStatusValue}>
              {getPaymentStatusLabel(selectedItem.status, t)}
            </strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_plan_id')}</span>
            <strong>{selectedItem.planId ?? '-'}</strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_payment_id')}</span>
            <strong>{selectedItem.providerPaymentId ?? '-'}</strong>
          </div>

          <div className={styles.modalRow}>
            <span>{t('dashboard.history_created')}</span>
            <strong>{formatDate(selectedItem.createdAt)}</strong>
          </div>

          <div className={`${styles.modalRow} ${styles.modalRowFullWide}`}>
            <span>{t('dashboard.history_updated')}</span>
            <strong>{formatDate(selectedItem.updatedAt)}</strong>
          </div>
          
          {selectedItem.lastError && (
            <div className={`${styles.modalError} ${styles.modalRowFullWide}`}>
              <span>{t('dashboard.history_error')}</span>
              <strong>{selectedItem.lastError}</strong>
            </div>
          )}
          
          {(selectedItem.providerInvoiceUrl || selectedItem.lastError) && (
            <div className={styles.modalSupportBlock}>
              {selectedItem.providerInvoiceUrl && (
                <Button
                  as="a"
                  href={selectedItem.providerInvoiceUrl}
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