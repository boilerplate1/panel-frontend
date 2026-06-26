import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Card } from '@/shared/ui';
import {
  formatCurrency,
  formatDate,
  getPaymentProviderIcon,
  getPaymentProviderLabel,
  getPaymentStatusLabel,
} from '@/shared/lib';
import { SOCIAL_LINKS } from '@/shared/config';
import styles from './modals/TransactionDetailModal.module.css';
import { useTransactionDetailPage } from '../model/useTransactionDetailPage';

function TransactionDetailPage() {
  const { t } = useTranslation();
  const page = useTransactionDetailPage();

  if (!page.user) return null;

  if (page.isLoading) {
    return (
      <div className={styles.detailPage}>
        <Card padding="medium" className={styles.pageCard}>
          <div className={styles.loadingState}>
            <Loader2 size={20} className={styles.spinner} />
            <span>{t('shared.loading')}</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!page.transaction && !page.isLoading) {
    return (
      <div className={styles.detailPage}>
        <Card padding="medium" className={styles.pageCard}>
          <strong className={styles.heroTitle}>{t('dashboard.history_empty')}</strong>
          <div className={styles.actionsBlock}>
            <Button type="button" variant="outline" onClick={page.backToHistory}>
              {t('shared.back')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const transaction = page.transaction;
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
    <div className={styles.detailPage}>
      {transaction ? (
        <>
          <Card padding="medium" className={styles.heroCard}>
            <Button
              type="button"
              variant="ghost"
              size="small"
              className={styles.backBtn}
              onClick={page.backToHistory}
            >
              <ArrowLeft size={18} />
              <span>{t('shared.back')}</span>
            </Button>

            <div className={styles.heroTop}>
              <div className={styles.heroTitleBlock}>
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
                  {formatCurrency(transaction.amountCents, transaction.currency, page.locale)}
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
          </Card>

          <Card padding="medium" className={styles.sectionCard}>
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
          </Card>

          {transaction.lastError ? (
            <Card padding="medium" className={styles.errorCard}>
              <span>{t('dashboard.history_error')}</span>
              <strong>{transaction.lastError}</strong>
            </Card>
          ) : null}

          {transaction.providerInvoiceUrl ? (
            <Card padding="medium" className={styles.actionsCard}>
              <Button
                as="a"
                href={transaction.providerInvoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalLink}
                variant="outline"
              >
                <ExternalLink size={18} />
                {t('dashboard.history_open_payment')}
              </Button>
              <a
                href={SOCIAL_LINKS.TG_CHANNEL}
                className={styles.supportLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('dashboard.history_payment_support_hint')}
              </a>
            </Card>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default TransactionDetailPage;
