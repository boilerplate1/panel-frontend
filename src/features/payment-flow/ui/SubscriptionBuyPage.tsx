import { useSubscriptionBuyFlow } from '../model/useSubscriptionBuyFlow';
import { CreatingPaymentState } from './steps/CreatingPaymentState';
import { PaymentMethodStep } from './steps/PaymentMethodStep';
import { PaymentProviderStep } from './steps/PaymentProviderStep';
import { PlanSelectionStep } from './steps/PlanSelectionStep';

function SubscriptionBuyPage() {
  const flow = useSubscriptionBuyFlow();

  if (!flow.user) return null;

  if (flow.stage === 'creating') {
    return <CreatingPaymentState />;
  }

  if (flow.step === 'method') {
    return (
      <PaymentMethodStep
        methods={flow.providersData?.methods?.[flow.selectedProvider] ?? []}
        isLoading={flow.providersLoading}
        onBack={flow.goBackFromMethods}
        onSelectMethod={(method) => flow.startPayment(flow.selectedProvider, method)}
      />
    );
  }

  if (flow.step === 'provider') {
    return (
      <PaymentProviderStep
        providers={flow.providersData?.providers ?? []}
        isLoading={flow.providersLoading}
        onBack={flow.goToPlans}
        onSelectProvider={flow.selectProvider}
      />
    );
  }

  return (
    <PlanSelectionStep
      plans={flow.plans}
      isLoading={flow.plansLoading}
      selectedPlan={flow.selectedPlan}
      bestValuePlanId={flow.bestValuePlanId}
      isRenewal={flow.isRenewal}
      newExpiryDate={flow.newExpiryDate}
      locale={flow.locale}
      monthLabels={flow.monthLabels}
      onBack={flow.goToDashboard}
      onSelectPlan={flow.selectPlan}
      onContinue={flow.goToProviderStep}
    />
  );
}

export default SubscriptionBuyPage;
