import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import {
  useCreatePaymentIntentMutation,
  usePaymentProvidersQuery,
  usePaymentStore,
} from '@/features/payment-management';
import { useSubscriptionPlansQuery, useSubscriptionsQuery } from '@/shared/api';
import { useUIStore } from '@/shared/lib';
import { buildPayMethodRoute, buildPayProviderRoute, buildPayStatusRoute, ROUTES } from '@/constants';
import { CreatingPaymentState } from './CreatingPaymentState';
import { PaymentMethodStep } from './PaymentMethodStep';
import { PaymentProviderStep } from './PaymentProviderStep';
import { PlanSelectionStep } from './PlanSelectionStep';

function waitForCreatingState() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 450);
  });
}

function SubscriptionBuyPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { i18n, t } = useTranslation();
  const { showToast } = useUIStore();
  const { stage, activePayment, setStage, setActivePayment } = usePaymentStore();

  const { data: plans, isLoading: plansLoading } = useSubscriptionPlansQuery(!!user);
  const { data: subscriptions } = useSubscriptionsQuery(!!user);
  const { data: providersData, isLoading: providersLoading } = usePaymentProvidersQuery();
  const createIntentMutation = useCreatePaymentIntentMutation();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const queryPlanId = Number(params.planId ?? searchParams.get('planId'));
  const routePlanId = Number.isFinite(queryPlanId) && queryPlanId > 0 ? queryPlanId : null;
  const selectedProvider = (params.provider ?? searchParams.get('provider') ?? 'yookassa').toLowerCase();

  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';
  const monthLabels = {
    singular: t('shared.month_1'),
    plural1: t('shared.month_2'),
    plural2: t('shared.month_5'),
  };

  const effectiveSelectedPlanId =
    selectedPlanId ?? routePlanId ?? activePayment?.planId ?? plans?.[0]?.id ?? null;
  const selectedPlan = plans?.find((p) => p.id === effectiveSelectedPlanId) ?? plans?.[0] ?? null;
  const bestValuePlanId =
    plans && plans.length > 1
      ? plans.reduce((best, plan) => {
          const bestDailyPrice = best.priceCents / Math.max(1, best.durationDays);
          const planDailyPrice = plan.priceCents / Math.max(1, plan.durationDays);
          if (planDailyPrice < bestDailyPrice) return plan;
          if (planDailyPrice === bestDailyPrice && plan.durationDays > best.durationDays) {
            return plan;
          }
          return best;
        }).id
      : null;
  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;
  const isRenewal = !!activeSubscription;

  const newExpiryDate = (() => {
    if (!selectedPlan) return null;

    try {
      const expiresAt = activeSubscription?.expiresAt;
      const parsedDate = expiresAt ? new Date(expiresAt).getTime() : null;
      const now = new Date();
      const baseDate =
        parsedDate && !Number.isNaN(parsedDate)
          ? new Date(Math.max(now.getTime(), parsedDate))
          : now;

      return new Date(baseDate.getTime() + selectedPlan.durationDays * 24 * 60 * 60 * 1000);
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (activePayment?.id && stage === 'active') {
      navigate(buildPayStatusRoute(activePayment.id), { replace: true });
    }
  }, [activePayment?.id, navigate, stage]);

  const startPayment = async (provider: string, method?: string) => {
    if (!selectedPlan) return;

    try {
      setStage('creating');
      const intent = await createIntentMutation.mutateAsync({
        planId: selectedPlan.id,
        provider,
        paymentMethod: method,
      });
      await waitForCreatingState();

      setActivePayment({
        id: intent.id,
        planId: selectedPlan.id,
        provider,
        status: intent.status,
        invoiceUrl: intent.providerInvoiceUrl ?? undefined,
      });

      setStage('active');
      navigate(buildPayStatusRoute(intent.id));
    } catch {
      setStage('idle');
      showToast(t('dashboard.buy_subscription_payment_failed'), 'error');
    }
  };

  const handleSelectProvider = async (provider: string) => {
    if (!selectedPlan) return;

    const normalizedProvider = provider.toLowerCase();
    if (normalizedProvider === 'yookassa') {
      navigate(buildPayMethodRoute(selectedPlan.id, normalizedProvider));
      return;
    }

    const providerMethods = providersData?.methods?.[normalizedProvider] ?? [];
    if (providerMethods.length > 0) {
      navigate(buildPayMethodRoute(selectedPlan.id, normalizedProvider));
      return;
    }

    await startPayment(provider);
  };

  if (!user) return null;

  if (stage === 'creating') {
    return <CreatingPaymentState />;
  }

  if (location.pathname.includes('/method/')) {
    return (
      <PaymentMethodStep
        methods={providersData?.methods?.[selectedProvider] ?? []}
        isLoading={providersLoading}
        onBack={() =>
          navigate(selectedPlan ? buildPayProviderRoute(selectedPlan.id) : ROUTES.PAY)
        }
        onSelectMethod={(method) => startPayment(selectedProvider, method)}
      />
    );
  }

  if (location.pathname.endsWith('/provider')) {
    return (
      <PaymentProviderStep
        providers={providersData?.providers ?? []}
        isLoading={providersLoading}
        onBack={() => navigate(ROUTES.PAY)}
        onSelectProvider={handleSelectProvider}
      />
    );
  }

  return (
    <PlanSelectionStep
      plans={plans}
      isLoading={plansLoading}
      selectedPlan={selectedPlan}
      bestValuePlanId={bestValuePlanId}
      isRenewal={isRenewal}
      newExpiryDate={newExpiryDate}
      locale={locale}
      monthLabels={monthLabels}
      onBack={() => navigate(ROUTES.DASHBOARD)}
      onSelectPlan={setSelectedPlanId}
      onContinue={() => {
        if (selectedPlan) navigate(buildPayProviderRoute(selectedPlan.id));
      }}
    />
  );
}

export default SubscriptionBuyPage;
