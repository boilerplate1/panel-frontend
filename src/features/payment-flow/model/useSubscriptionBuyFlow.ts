import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useCreatePaymentIntentMutation,
  usePaymentProvidersQuery,
  useSubscriptionPlansQuery,
  useSubscriptionsQuery,
} from '@/shared/api';
import { getMonthLabels } from '@/shared/lib';
import {
  buildCheckoutProviderMethodsRoute,
  buildCheckoutProviderRoute,
  buildCheckoutStatusRoute,
  ROUTES,
} from '@/constants';
import { useAuth } from '@/stores/authStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { useUIStore } from '@/stores/uiStore';
import {
  getActiveSubscription,
  getBestValuePlanId,
  getPositiveRoutePlanId,
  getRenewalExpiryDate,
  getSelectedPlan,
  getSelectedProvider,
  waitForCreatingState,
} from '../lib/subscriptionBuy';

export function useSubscriptionBuyFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { i18n, t } = useTranslation();
  const { showToast } = useUIStore();
  const { stage, activePayment, setStage, setActivePayment } = usePaymentStore();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const { data: plans, isLoading: plansLoading } = useSubscriptionPlansQuery(!!user);
  const { data: subscriptions } = useSubscriptionsQuery(!!user);
  const { data: providersData, isLoading: providersLoading } = usePaymentProvidersQuery();
  const createIntentMutation = useCreatePaymentIntentMutation();

  const routePlanId = getPositiveRoutePlanId(params.planId ?? searchParams.get('planId'));
  const selectedProvider = getSelectedProvider(params.provider ?? searchParams.get('provider'));
  const step = params.provider ? 'method' : routePlanId ? 'provider' : 'plans';
  const selectedPlan = getSelectedPlan(plans, selectedPlanId, routePlanId, activePayment?.planId);
  const activeSubscription = getActiveSubscription(subscriptions);

  useEffect(() => {
    if (activePayment?.id && stage === 'active') {
      navigate(buildCheckoutStatusRoute(activePayment.id), { replace: true });
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
      navigate(buildCheckoutStatusRoute(intent.id));
    } catch {
      setStage('idle');
      showToast(t('dashboard.buy_subscription_payment_failed'), 'error');
    }
  };

  const selectProvider = async (provider: string) => {
    if (!selectedPlan) return;

    const normalizedProvider = provider.toLowerCase();
    const providerMethods = providersData?.methods?.[normalizedProvider] ?? [];

    if (normalizedProvider === 'yookassa' || providerMethods.length > 0) {
      navigate(buildCheckoutProviderMethodsRoute(selectedPlan.id, normalizedProvider));
      return;
    }

    await startPayment(provider);
  };

  return {
    user,
    stage,
    step,
    selectedProvider,
    providersData,
    providersLoading,
    plans,
    plansLoading,
    selectedPlan,
    bestValuePlanId: getBestValuePlanId(plans),
    isRenewal: !!activeSubscription,
    newExpiryDate: getRenewalExpiryDate(selectedPlan, activeSubscription),
    locale: i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US',
    monthLabels: getMonthLabels(t),
    selectPlan: setSelectedPlanId,
    selectProvider,
    startPayment,
    goToPlans: () => navigate(ROUTES.CHECKOUT),
    goToDashboard: () => navigate(ROUTES.DASHBOARD),
    goToProviderStep: () => {
      if (selectedPlan) navigate(buildCheckoutProviderRoute(selectedPlan.id));
    },
    goBackFromMethods: () =>
      navigate(selectedPlan ? buildCheckoutProviderRoute(selectedPlan.id) : ROUTES.CHECKOUT),
  };
}
