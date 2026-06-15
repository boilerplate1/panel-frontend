import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePaymentHistoryInfiniteQuery } from '@/features/payment-management';
import {
  formatCurrency,
  formatDate,
  getPaymentProviderIcon,
  getPaymentProviderLabel,
  getPaymentStatusLabel,
} from '@/shared/lib';
import { Button, Card, SectionHeader, ResponsiveModal } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import styles from './BalanceHistoryDetailPage.module.css';

function BalanceHistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { data, isLoading } = usePaymentHistoryInfiniteQuery(true);

  const history = data?.pages.flatMap((page) => page.items) ?? [];
  const selectedItem = history.find((item) => item.id === id) ?? null;

  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';

  const handleClose = () => {
    navigate(ROUTES.HISTORY);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} />
      </div>
    );
  }

  return (
    <ResponsiveModal
      isOpen={true}
      onClose={handleClose}
      title={selectedItem?.planName ?? t('dashboard.subscriptions')}
    >
      {selectedItem ? (
        <div className={styles.modalGrid}>
          {/* ... modal content ... */}
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
          {/* ... other rows ... */}
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
                  variant="secondary"
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
        <p>{t('dashboard.history_empty')}</p>
      )}
    </ResponsiveModal>
  );
}

export default BalanceHistoryDetailPage;
