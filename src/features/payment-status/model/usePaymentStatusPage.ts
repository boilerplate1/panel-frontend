import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useCancelPaymentIntentMutation,
  useCheckPaymentIntentQuery,
  useSubscriptionPlansQuery,
} from '@/shared/api';
import {
  formatCurrency,
  formatPlanDurationLabel,
  getApiErrorMessage,
  getMonthLabels,
} from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import { usePaymentStore } from '@/stores/paymentStore';
import { useUIStore } from '@/stores/uiStore';

export function usePaymentStatusPage() {
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
  const paymentPlan = plans?.find((plan) => plan.id === paymentPlanId) ?? null;
  const invoiceUrl = currentIntent?.providerInvoiceUrl ?? activePayment?.invoiceUrl;
  const paymentProvider = currentIntent?.provider ?? activePayment?.provider ?? null;
  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';
  const monthLabels = getMonthLabels(t);
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
      navigate(ROUTES.CHECKOUT, { replace: true });
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

  const cancelPayment = async () => {
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

  return {
    intentId,
    invoiceUrl,
    paymentProvider,
    paymentSubject,
    countdown,
    isFetching,
    isLoading,
    isError,
    isCancelling: cancelIntentMutation.isPending,
    cancelPayment,
  };
}
