import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  useCancelPaymentIntentMutation,
  useCheckPaymentIntentQuery,
  usePaymentStore,
} from '@/features/payment-management';
import { useSubscriptionPlansQuery } from '@/shared/api';
import { Button, Card } from '@/shared/ui';
import {
  formatCurrency,
  formatPlanDurationLabel,
  getApiErrorMessage,
  getPaymentProviderLabel,
  useUIStore,
} from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import styles from './PaymentStatusPage.module.css';

function PaymentStatusPage() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { showToast } = useUIStore();
  const { activePayment, reset } = usePaymentStore();
  const cancelIntentMutation = useCancelPaymentIntentMutation();
  const intentId = params.intentId ?? searchParams.get('intentId') ?? activePayment?.id ?? null;
  const [countdown, setCountdown] = useState(10);
  const {
    data: currentIntent,
    refetch: refetchStatus,
    isFetching,
    isLoading,
    isError,
  } = useCheckPaymentIntentQuery(intentId);
  const paymentPlanId = currentIntent?.planId ?? activePayment?.planId ?? null;
  const { data: plans } = useSubscriptionPlansQuery(!!paymentPlanId);

  const invoiceUrl = currentIntent?.providerInvoiceUrl ?? activePayment?.invoiceUrl;
  const paymentProvider = currentIntent?.provider ?? activePayment?.provider ?? null;
  const paymentPlan = plans?.find((plan) => plan.id === paymentPlanId) ?? null;
  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';
  const monthLabels = {
    singular: t('shared.month_1'),
    plural1: t('shared.month_2'),
    plural2: t('shared.month_5'),
  };
  const paymentAmount = currentIntent
    ? formatCurrency(currentIntent.amountCents, currentIntent.currency, locale)
    : null;
  const paymentSubject = paymentPlan
    ? `${formatPlanDurationLabel(paymentPlan.durationDays, monthLabels)}${
        paymentAmount ? ` · ${paymentAmount}` : ''
      }`
    : paymentPlanId
      ? `${t('dashboard.buy_subscription_plan_label')} #${paymentPlanId}${
          paymentAmount ? ` · ${paymentAmount}` : ''
        }`
      : paymentAmount;

  useEffect(() => {
    if (!intentId) {
      navigate(ROUTES.PAY, { replace: true });
    }
  }, [intentId, navigate]);

  useEffect(() => {
    if (!currentIntent) return;

    const status = currentIntent.status.toUpperCase();
    if (status === 'PAID') {
      navigate(`${ROUTES.PAYMENT_SUCCESS}?intentId=${currentIntent.id}`, { replace: true });
    } else if (status === 'FAILED' || status === 'CANCELED' || status === 'EXPIRED') {
      navigate(`${ROUTES.PAYMENT_FAILED}?intentId=${currentIntent.id}`, { replace: true });
    }
  }, [currentIntent, navigate]);

  useEffect(() => {
    if (!intentId || isError || isFetching || isLoading) return;

    const timer = window.setTimeout(() => {
      if (countdown <= 1) {
        refetchStatus().finally(() => setCountdown(10));
        return;
      }

      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, intentId, isError, isFetching, isLoading, refetchStatus]);

  useEffect(() => {
    if (isError) {
      reset();
    }
  }, [isError, reset]);

  const handleCancelPayment = async () => {
    if (!intentId) {
      reset();
      navigate(ROUTES.DASHBOARD);
      return;
    }

    try {
      await cancelIntentMutation.mutateAsync(intentId);
      showToast(t('dashboard.buy_subscription_cancelled'), 'success');
      reset();
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const msg = getApiErrorMessage(err, t('shared.error'), t);
      showToast(msg, 'error');
    }
  };

  if (isError) {
    return (
      <div className={styles.wrapper}>
        <Card variant="outline" padding="none" className={styles.card}>
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
            <h1 className={styles.title}>{t('dashboard.buy_subscription_payment_not_found')}</h1>
            <p className={styles.text}>{t('dashboard.buy_subscription_payment_not_found_hint')}</p>
          </div>

          <div className={styles.actions}>
            <Button as={Link} to={ROUTES.PAY} variant="outline">
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
      <Card variant="outline" padding="none" className={styles.card}>
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

        {paymentSubject || intentId || paymentProvider ? (
          <div className={styles.meta}>
            {paymentSubject ? (
              <div className={styles.metaRow}>
                <span>{t('dashboard.buy_subscription_payment_subject')}</span>
                <strong>{paymentSubject}</strong>
              </div>
            ) : null}
            {paymentProvider ? (
              <div className={styles.metaRow}>
                <span>{t('dashboard.buy_subscription_payment_method')}</span>
                <strong>{getPaymentProviderLabel(paymentProvider)}</strong>
              </div>
            ) : null}
            {intentId ? (
              <div className={styles.metaRow}>
                <span>{t('dashboard.history_payment_id')}</span>
                <strong>{intentId}</strong>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={styles.actions}>
          {invoiceUrl ? (
            <Button
              as="a"
              href={invoiceUrl}
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
            onClick={handleCancelPayment}
            disabled={cancelIntentMutation.isPending}
            type="button"
          >
            {cancelIntentMutation.isPending ? (
              <Loader2 size={14} className={styles.spinner} />
            ) : null}
            {t('dashboard.buy_subscription_cancel')}
          </button>
        </div>

        <div className={styles.autoCheck} aria-live="polite">
          <span>{t('dashboard.buy_subscription_auto_check')}</span>
          <strong>
            {isFetching || isLoading
              ? t('dashboard.buy_subscription_checking')
              : t('dashboard.buy_subscription_auto_check_timer', { seconds: countdown })}
          </strong>
        </div>
      </Card>
    </div>
  );
}

export default PaymentStatusPage;
