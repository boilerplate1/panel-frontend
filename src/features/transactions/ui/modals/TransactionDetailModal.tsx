import { useTranslation } from 'react-i18next';
import { Badge, ResponsiveModal, Button } from '@/shared/ui';
import {
  formatCurrency,
  formatDate,
  getPaymentProviderIcon,
  getPaymentProviderLabel,
  getPaymentStatusLabel,
} from '@/shared/lib';
import { SOCIAL_LINKS } from '@/constants';
import type { PaymentHistoryItem } from '@/shared/api/generated';
import styles from './TransactionDetailModal.module.css';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentHistoryItem | null;
  locale: 'ru-RU' | 'en-US';
}

export function TransactionDetailModal({
  isOpen,
  onClose,
  transaction,
  locale,
}: TransactionDetailModalProps) {
  const { t } = useTranslation();
  const providerInvoiceUrl = transaction?.providerInvoiceUrl ?? undefined;
  const providerIcon = transaction ? getPaymentProviderIcon(transaction.provider) : null;
  const statusLabel = transaction ? getPaymentStatusLabel(transaction.status, t) : '';
  const statusVariant = transaction
    ? transaction.status.toLowerCase() === 'paid'
      ? 'success'
      : transaction.status.toLowerCase() === 'failed' ||
          transaction.status.toLowerCase() === 'canceled' ||
          transaction.status.toLowerCase() === 'expired'
        ? 'danger'
        : transaction.status.toLowerCase() === 'pending' ||
            transaction.status.toLowerCase() === 'processing' ||
            transaction.status.toLowerCase() === 'waiting'
          ? 'neutral'
          : 'neutral'
    : 'neutral';

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t('dashboard.history_title')}>
      {transaction ? (
        <div className={styles.detailPage}>
          <section className={styles.hero}>
            <div className={styles.heroTop}>
              <div className={styles.heroTitleBlock}>
                <span className={styles.heroEyebrow}>{t('dashboard.history_title')}</span>
                <strong className={styles.heroTitle}>
                  {transaction.planName ?? t('dashboard.subscriptions')}
                </strong>
              </div>
              <Badge variant={statusVariant} className={styles.statusBadge}>
                {statusLabel}
              </Badge>
            </div>

            <div className={styles.heroMain}>
              <div className={styles.amountBlock}>
                <span>{t('dashboard.history_amount')}</span>
                <strong>
                  {formatCurrency(transaction.amountCents, transaction.currency, locale)}
                </strong>
              </div>

              <div className={styles.providerBlock}>
                <span>{t('dashboard.history_provider')}</span>
                <strong>
                  {providerIcon ? (
                    <img
                      src={providerIcon}
                      alt={getPaymentProviderLabel(transaction.provider)}
                      className={styles.providerIcon}
                    />
                  ) : null}
                  <span>{getPaymentProviderLabel(transaction.provider)}</span>
                </strong>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>{t('dashboard.history_details')}</div>
            <div className={styles.grid}>
              <div className={styles.row}>
                <span>{t('dashboard.history_plan_id')}</span>
                <strong>{transaction.planId ?? '-'}</strong>
              </div>
              <div className={styles.row}>
                <span>{t('dashboard.history_payment_id')}</span>
                <strong>{transaction.providerPaymentId ?? '-'}</strong>
              </div>
              <div className={styles.row}>
                <span>{t('dashboard.history_created')}</span>
                <strong>{formatDate(transaction.createdAt)}</strong>
              </div>
              <div className={styles.row}>
                <span>{t('dashboard.history_updated')}</span>
                <strong>{formatDate(transaction.updatedAt)}</strong>
              </div>
              {transaction.creditedAt ? (
                <div className={styles.row}>
                  <span>{t('dashboard.history_credited')}</span>
                  <strong>{formatDate(transaction.creditedAt)}</strong>
                </div>
              ) : null}
              {transaction.expiresAt ? (
                <div className={styles.row}>
                  <span>{t('dashboard.history_expires')}</span>
                  <strong>{formatDate(transaction.expiresAt)}</strong>
                </div>
              ) : null}
            </div>
          </section>

          {transaction.lastError ? (
            <section className={styles.errorBlock}>
              <span>{t('dashboard.history_error')}</span>
              <strong>{transaction.lastError}</strong>
            </section>
          ) : null}

          {(providerInvoiceUrl || transaction.lastError) && (
            <section className={styles.actionsBlock}>
              {providerInvoiceUrl && (
                <Button
                  as="a"
                  href={providerInvoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalLink}
                  variant="accentSoft"
                >
                  {t('dashboard.history_open_payment')}
                </Button>
              )}
              <a
                href={SOCIAL_LINKS.TG_CHANNEL}
                className={styles.supportLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('dashboard.history_payment_support_hint')}
              </a>
            </section>
          )}
        </div>
      ) : (
        <p className={styles.emptyText}>{t('dashboard.history_empty')}</p>
      )}
    </ResponsiveModal>
  );
}
