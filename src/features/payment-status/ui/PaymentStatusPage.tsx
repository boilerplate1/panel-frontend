import { Link } from 'react-router-dom';
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '@/shared/ui';
import { getPaymentProviderLabel } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import { usePaymentStatusPage } from '../model/usePaymentStatusPage';
import styles from './PaymentStatusPage.module.css';

function PaymentStatusPage() {
  const { t } = useTranslation();
  const paymentStatus = usePaymentStatusPage();

  if (paymentStatus.isError) {
    const isNetworkError = paymentStatus.errorKind === 'network';
    const isForbidden = paymentStatus.errorKind === 'forbidden';
    const isNotFound = paymentStatus.errorKind === 'not_found';
    const title = isNetworkError
      ? t('dashboard.buy_subscription_payment_offline_title')
      : isForbidden
        ? t('dashboard.buy_subscription_payment_forbidden_title')
        : isNotFound
          ? t('dashboard.buy_subscription_payment_not_found')
          : t('dashboard.buy_subscription_payment_error_title');
    const text = isNetworkError
      ? t('dashboard.buy_subscription_payment_offline_hint')
      : isForbidden
        ? t('dashboard.buy_subscription_payment_forbidden_hint')
        : isNotFound
          ? t('dashboard.buy_subscription_payment_not_found_hint')
          : t('shared.server_error');

    return (
      <div className={styles.wrapper}>
        <Card variant="flat" padding="medium" className={styles.card}>
          <div className={styles.iconWrap}>
            <svg viewBox="0 0 80 80" className={styles.resultIcon} aria-hidden="true">
              <circle className={styles.failedAura} cx="50%" cy="50%" r="50%" />
              <circle className={styles.failedRing} cx="50%" cy="50%" r="37" />
              <path
                className={styles.failedMark}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M40 36.5 52.6 23.9 56.1 27.4 43.5 40 56.1 52.6 52.6 56.1 40 43.5 27.4 56.1 23.9 52.6 36.5 40 23.9 27.4 27.4 23.9 40 36.5Z"
              />
            </svg>
          </div>

          <div className={styles.content}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.text}>{text}</p>
          </div>

          <div className={styles.actions}>
            {isNetworkError ? (
              <Button type="button" variant="outline" onClick={() => paymentStatus.refetchStatus()}>
                <RefreshCw size={18} />
                {t('shared.retry')}
              </Button>
            ) : null}
            {paymentStatus.invoiceUrl ? (
              <Button
                as="a"
                href={paymentStatus.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                <ExternalLink size={18} />
                {t('dashboard.buy_subscription_open_payment')}
              </Button>
            ) : null}
            <Button as={Link} to={ROUTES.CHECKOUT} variant="outline">
              {t('dashboard.buy_subscription_new_purchase')}
            </Button>
            <Button as={Link} to={ROUTES.DASHBOARD} variant="secondary">
              {t('shared.back_to_dashboard')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Card variant="flat" padding="medium" className={styles.card}>
        <div className={styles.iconWrap}>
          <svg viewBox="0 0 80 80" className={styles.resultIcon} aria-hidden="true">
            <circle className={styles.pendingAura} cx="50%" cy="50%" r="50%" />
            <circle className={styles.pendingRing} cx="50%" cy="50%" r="37" />
            <path className={styles.pendingMark} d="M38 22h4v20H38z" />
            <path className={styles.pendingMark} d="M38 38h16v4H38z" />
          </svg>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{t('dashboard.buy_subscription_waiting')}</h1>
          <p className={styles.text}>{t('dashboard.buy_subscription_active_subtitle')}</p>
        </div>

        {paymentStatus.paymentSubject || paymentStatus.intentId || paymentStatus.paymentProvider ? (
          <div className={styles.meta}>
            {paymentStatus.paymentSubject ? (
              <div className={styles.metaRow}>
                <span>{t('dashboard.buy_subscription_payment_subject')}</span>
                <strong>{paymentStatus.paymentSubject}</strong>
              </div>
            ) : null}
            {paymentStatus.paymentProvider ? (
              <div className={styles.metaRow}>
                <span>{t('dashboard.buy_subscription_payment_method')}</span>
                <strong>{getPaymentProviderLabel(paymentStatus.paymentProvider)}</strong>
              </div>
            ) : null}
            {paymentStatus.intentId ? (
              <div className={styles.metaRow}>
                <span>{t('dashboard.history_payment_id')}</span>
                <strong>{paymentStatus.intentId}</strong>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={styles.actions}>
          {paymentStatus.invoiceUrl ? (
            <Button
              as="a"
              href={paymentStatus.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              <ExternalLink size={18} />
              {t('dashboard.buy_subscription_open_payment')}
            </Button>
          ) : null}
          <Button as={Link} to={ROUTES.DASHBOARD} variant="outline">
            {t('shared.back_to_dashboard')}
          </Button>
          <button
            className={styles.cancelLink}
            onClick={paymentStatus.cancelPayment}
            disabled={paymentStatus.isCancelling}
            type="button"
          >
            {paymentStatus.isCancelling ? <Loader2 size={14} className={styles.spinner} /> : null}
            {t('dashboard.buy_subscription_cancel')}
          </button>
        </div>

        <div className={styles.autoCheck} aria-live="polite">
          <span>{t('dashboard.buy_subscription_auto_check')}</span>
          <strong>
            {paymentStatus.isFetching || paymentStatus.isLoading
              ? t('dashboard.buy_subscription_checking')
              : t('dashboard.buy_subscription_auto_check_timer', {
                  seconds: paymentStatus.countdown,
                })}
          </strong>
        </div>
      </Card>
    </div>
  );
}

export default PaymentStatusPage;
