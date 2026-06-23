import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import { useCheckPaymentIntentQuery } from '@/features/payment-management';
import { useSubscriptionPlansQuery } from '@/shared/api';
import { formatDate, formatPlanDurationLabel, queryClient } from '@/shared/lib';
import { Button, Card, Logo } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { usePaymentStore } from '@/stores/paymentStore';
import styles from './PaymentResultPage.module.css';

type ResultState = 'success' | 'pending' | 'failed';

function getIntentId(search: string) {
  const params = new URLSearchParams(search);
  return params.get('intentId') ?? params.get('paymentId') ?? params.get('id');
}

function getQueryValue(search: string, keys: string[]) {
  const params = new URLSearchParams(search);
  for (const key of keys) {
    const value = params.get(key);
    if (value) return value;
  }
  return null;
}

function PaymentResultPage() {
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { activePayment, reset } = usePaymentStore();
  const isDashboardRoute = location.pathname.startsWith('/dashboard/');
  const intentId = getIntentId(location.search) ?? activePayment?.id ?? null;
  const statusQuery = useCheckPaymentIntentQuery(intentId, isAuthenticated);
  const { data: plans } = useSubscriptionPlansQuery(isAuthenticated);
  const routeState: ResultState = location.pathname.endsWith('/failed') ? 'failed' : 'success';
  const normalizedStatus = statusQuery.data?.status.toUpperCase();

  const resultState: ResultState =
    normalizedStatus === 'PAID'
      ? 'success'
      : normalizedStatus === 'FAILED' ||
          normalizedStatus === 'CANCELED' ||
          normalizedStatus === 'EXPIRED'
        ? 'failed'
        : normalizedStatus
          ? 'pending'
          : routeState;

  useEffect(() => {
    if (isAuthenticated && (resultState === 'success' || resultState === 'failed')) {
      reset();
    }

    if (isAuthenticated && resultState === 'success') {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'history'] });
    }
  }, [isAuthenticated, reset, resultState]);

  const isChecking = isAuthenticated && !!intentId && statusQuery.isFetching;
  const isSuccess = resultState === 'success';
  const isFailed = resultState === 'failed';
  const headerTitle = isChecking
    ? t('dashboard.payment_result_checking_title')
    : isSuccess
      ? t('dashboard.payment_result_success_title')
      : isFailed
        ? t('dashboard.payment_result_failed_title')
        : t('dashboard.payment_result_pending_title');
  const description = isSuccess
    ? t('dashboard.payment_result_success_subtitle')
    : isFailed
      ? t('dashboard.payment_result_failed_subtitle')
      : isChecking
        ? t('dashboard.payment_result_checking_subtitle')
        : t('dashboard.payment_result_pending_subtitle');
  const monthLabels = {
    singular: t('shared.month_1'),
    plural1: t('shared.month_2'),
    plural2: t('shared.month_5'),
  };
  const queryDuration = getQueryValue(location.search, ['durationDays', 'days', 'termDays']);
  const queryExpiresAt = getQueryValue(location.search, ['expiresAt', 'subscriptionExpiresAt']);
  const queryError = getQueryValue(location.search, ['error', 'message', 'reason']);
  const selectedPlan = plans?.find((plan) => plan.id === statusQuery.data?.planId);
  const durationDays = selectedPlan?.durationDays ?? (queryDuration ? Number(queryDuration) : null);
  const durationLabel =
    durationDays && Number.isFinite(durationDays)
      ? formatPlanDurationLabel(durationDays, monthLabels)
      : null;
  const expiresAt = statusQuery.data?.expiresAt ?? queryExpiresAt;
  const paymentError = statusQuery.data?.lastError ?? queryError;

  return (
    <div className={`${styles.screen} ${isDashboardRoute ? styles.embedded : ''}`}>
      {!isDashboardRoute ? (
        <header className={styles.publicHeader}>
          <Link to={ROUTES.HOME} className={styles.logoLink} aria-label="Hypex">
            <Logo className={styles.logo} />
          </Link>
          <span className={styles.headerTitle}>{headerTitle}</span>
        </header>
      ) : null}

      <main className={styles.wrapper}>
        <Card variant="outline" padding="none" className={styles.card}>
          <div className={styles.iconWrap}>
            {isChecking ? (
              <svg viewBox="0 0 80 80" className={styles.resultIcon} aria-hidden="true">
                <circle className={styles.pendingAura} cx="50%" cy="50%" r="50%" />
                <circle className={styles.pendingRing} cx="50%" cy="50%" r="37" />
                <path className={styles.pendingMark} d="M38 22h4v20H38z" />
                <path className={styles.pendingMark} d="M38 38h16v4H38z" />
              </svg>
            ) : isSuccess ? (
              <svg viewBox="0 0 80 80" className={styles.resultIcon} aria-hidden="true">
                <circle className={styles.successAura} cx="50%" cy="50%" r="50%" />
                <circle className={styles.successRing} cx="50%" cy="50%" r="37" />
                <path
                  className={styles.successMark}
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M35.1 48.5 24.6 38 21 41.6l14.1 14.1L59.4 31.4 55.8 27.8 35.1 48.5Z"
                />
              </svg>
            ) : isFailed ? (
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
            ) : (
              <svg viewBox="0 0 80 80" className={styles.resultIcon} aria-hidden="true">
                <circle className={styles.pendingAura} cx="50%" cy="50%" r="50%" />
                <circle className={styles.pendingRing} cx="50%" cy="50%" r="37" />
                <circle className={styles.pendingMark} cx="28" cy="40" r="4" />
                <circle className={styles.pendingMark} cx="40" cy="40" r="4" />
                <circle className={styles.pendingMark} cx="52" cy="40" r="4" />
              </svg>
            )}
          </div>

          <div className={styles.content}>
            <h1 className={styles.title}>{headerTitle}</h1>
            {description ? <p className={styles.text}>{description}</p> : null}
          </div>

          {intentId ? (
            <div className={styles.meta}>
              <span>{t('dashboard.history_payment_id')}</span>
              <strong>{intentId}</strong>
            </div>
          ) : null}

          {(isSuccess && (durationLabel || expiresAt)) || (isFailed && paymentError) ? (
            <div className={styles.details}>
              {isSuccess && durationLabel ? (
                <div className={styles.detailRow}>
                  <span>{t('dashboard.payment_result_term')}</span>
                  <strong>{durationLabel}</strong>
                </div>
              ) : null}
              {isSuccess && expiresAt ? (
                <div className={styles.detailRow}>
                  <span>{t('dashboard.payment_result_active_until')}</span>
                  <strong>{formatDate(expiresAt)}</strong>
                </div>
              ) : null}
              {isFailed && paymentError ? (
                <div className={styles.detailRow}>
                  <span>{t('dashboard.payment_result_error_reason')}</span>
                  <strong>{paymentError}</strong>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className={styles.actions}>
            <Button
              as={Link}
              to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
              variant="outline"
            >
              {isAuthenticated ? t('shared.back_to_dashboard') : t('auth.login')}
            </Button>
            {!isSuccess ? (
              <Button as={Link} to={ROUTES.PAY} variant="outline">
                {t('dashboard.payment_result_try_again')}
              </Button>
            ) : null}
          </div>
        </Card>
      </main>
    </div>
  );
}

export default PaymentResultPage;
