import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Loader2,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar,
  Flame,
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useSubscriptionPlansQuery, useSubscriptionsQuery } from '@/shared/api';
import {
  usePaymentStore,
  useCreatePaymentIntentMutation,
  usePaymentProvidersQuery,
  useCheckPaymentIntentQuery,
  useCancelPaymentIntentMutation,
} from '@/features/payment-management';
import { Button, Card, SectionHeader, Skeleton } from '@/shared/ui';
import { SbpIcon, YookassaIcon, MirIcon } from '@/shared/assets/icons';
import {
  useUIStore,
  formatCurrency,
  formatPlanDurationLabel,
  formatPerMonthLabel,
  formatDate,
  getApiErrorMessage,
} from '@/shared/lib';
import { ROUTES, PAYMENT_METHOD_ICONS, YOOKASSA_PAYMENT_METHODS } from '@/constants';
import styles from './SubscriptionBuyPage.module.css';

function SubscriptionBuyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { showToast } = useUIStore();
  const { stage, activePayment, setStage, setActivePayment, reset } = usePaymentStore();

  const { data: plans, isLoading: plansLoading } = useSubscriptionPlansQuery(!!user);
  const { data: subscriptions } = useSubscriptionsQuery(!!user);
  const { data: providersData, isLoading: providersLoading } = usePaymentProvidersQuery();
  const createIntentMutation = useCreatePaymentIntentMutation();
  const cancelIntentMutation = useCancelPaymentIntentMutation();
  const {
    data: currentIntent,
    refetch: refetchStatus,
    isFetching: isCheckingStatus,
  } = useCheckPaymentIntentQuery(activePayment?.id ?? null);

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(10);

  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';

  const monthLabels = {
    singular: t('shared.month_1'),
    plural1: t('shared.month_2'),
    plural2: t('shared.month_5'),
  };

  useEffect(() => {
    if (stage !== 'active') {
      setCountdown(10);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refetchStatus();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, refetchStatus]);

  useEffect(() => {
    if (plans && plans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(activePayment?.planId ?? plans[0].id);
    }
  }, [plans, activePayment?.planId, selectedPlanId]);

  useEffect(() => {
    if (currentIntent) {
      const status = currentIntent.status.toUpperCase();
      if (status === 'PAID') setStage('success');
      else if (status === 'FAILED' || status === 'CANCELED' || status === 'EXPIRED')
        setStage('failed');
      else if (status === 'REQUIRES_ACTION') setStage('active');
    }
  }, [currentIntent, setStage]);

  const selectedPlan = plans?.find((p) => p.id === selectedPlanId) ?? plans?.[0] ?? null;
  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;
  const isRenewal = !!activeSubscription;

  const getNewExpiryDate = () => {
    if (!selectedPlan) return null;

    try {
      const expiresAt = activeSubscription?.expiresAt;
      const parsedDate = expiresAt ? new Date(expiresAt).getTime() : null;
      const baseDate =
        parsedDate && !Number.isNaN(parsedDate)
          ? new Date(Math.max(Date.now(), parsedDate))
          : new Date();

      return new Date(baseDate.getTime() + selectedPlan.durationDays * 24 * 60 * 60 * 1000);
    } catch {
      return null;
    }
  };

  const newExpiryDate = getNewExpiryDate();

  const handleContinueToPayment = () => {
    if (!selectedPlan) return;
    setStage('selecting_method');
  };

  const handleSelectProvider = async (provider: string) => {
    if (!selectedPlan) return;
    const normalizedProvider = provider.toLowerCase();

    if (normalizedProvider === 'yookassa') {
      setStage('selecting_sub_method');
      return;
    }

    await startPayment(normalizedProvider);
  };

  const startPayment = async (provider: string, method?: string) => {
    if (!selectedPlan) return;

    try {
      setStage('creating');
      const intent = await createIntentMutation.mutateAsync({
        planId: selectedPlan.id,
        provider,
        paymentMethod: method,
      });

      setActivePayment({
        id: intent.id,
        planId: selectedPlan.id,
        provider,
        status: intent.status,
        invoiceUrl: intent.providerInvoiceUrl ?? undefined,
      });

      setStage('active');
      if (intent.providerInvoiceUrl) {
        window.open(intent.providerInvoiceUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setStage('failed');
      showToast(t('dashboard.buy_subscription_payment_failed'), 'error');
    }
  };

  const handleCancelPayment = async () => {
    if (!activePayment?.id) {
      reset();
      return;
    }

    try {
      await cancelIntentMutation.mutateAsync(activePayment.id);
      showToast(t('dashboard.buy_subscription_cancelled'), 'success');
      handleReturnToDashboard();
    } catch (err) {
      const msg = getApiErrorMessage(err, t('shared.error'), t);
      showToast(msg, 'error');
      handleReturnToDashboard();
    }
  };

  const handleGoBack = () => {
    if (stage === 'selecting_sub_method') {
      setStage('selecting_method');
    } else if (stage === 'selecting_method') {
      setStage('idle');
    } else {
      handleReturnToDashboard();
    }
  };

  const handleReturnToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
    setTimeout(() => {
      reset();
    }, 100);
  };

  if (!user) return null;

  if (stage === 'success') {
    return (
      <div className={styles.wrapper}>
        <Card className={styles.statusCard}>
          <CheckCircle2 size={64} className={styles.statusSuccess} />
          <div className={styles.statusTitle}>{t('dashboard.buy_subscription_paid')}</div>
          <p className={styles.statusText}>{t('dashboard.purchase_success')}</p>
          <div className={styles.statusActions}>
            <Button onClick={handleReturnToDashboard}>{t('shared.back_to_dashboard')}</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (stage === 'active' || stage === 'creating' || stage === 'checking' || stage === 'failed') {
    const isFailed = stage === 'failed';
    const isCreating = stage === 'creating';

    return (
      <div className={styles.wrapper}>
        <Card className={styles.statusCard}>
          <div className={styles.statusVisual}>
            {isCreating || isCheckingStatus ? (
              <Loader2 size={48} className={styles.spinner} />
            ) : isFailed ? (
              <XCircle size={48} className={styles.statusError} />
            ) : (
              <div className={styles.timerCircle}>
                <svg viewBox="0 0 36 36" className={styles.circularChart}>
                  <path
                    className={styles.circleBg}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={styles.circle}
                    strokeDasharray={`${(countdown / 10) * 100}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className={styles.timerCount}>{countdown}</span>
              </div>
            )}
          </div>

          <div className={styles.statusHeader}>
            <div className={styles.statusTitle}>
              {isCreating
                ? t('dashboard.buy_subscription_creating_payment')
                : isCheckingStatus
                  ? t('dashboard.buy_subscription_checking')
                  : isFailed
                    ? t('dashboard.buy_subscription_failed')
                    : t('dashboard.buy_subscription_waiting')}
            </div>

            <p className={styles.statusText}>
              {isFailed
                ? t('dashboard.buy_subscription_payment_failed_state')
                : t('dashboard.buy_subscription_active_subtitle')}
            </p>
          </div>

          <div className={styles.statusActions}>
            {activePayment?.invoiceUrl && !isFailed && (
              <Button
                as="a"
                href={activePayment.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={20} />
                <span>{t('dashboard.buy_subscription_open_payment')}</span>
              </Button>
            )}

            <Button variant="secondary" onClick={handleReturnToDashboard}>
              {t('shared.back_to_dashboard')}
            </Button>

            {!isFailed && !isCreating && (
              <button
                className={styles.cancelLink}
                onClick={handleCancelPayment}
                disabled={cancelIntentMutation.isPending}
              >
                {t('dashboard.buy_subscription_cancel')}
              </button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (stage === 'selecting_sub_method') {
    const yookassaMethods = YOOKASSA_PAYMENT_METHODS.map((id) => ({
      id,
      icon: id === 'bank_card' ? MirIcon : id === 'sbp' ? SbpIcon : YookassaIcon,
      label:
        id === 'bank_card'
          ? t('dashboard.buy_subscription_method_bank_card')
          : id === 'sbp'
            ? t('dashboard.buy_subscription_method_sbp')
            : t('dashboard.buy_subscription_method_yoomoney'),
      desc:
        id === 'bank_card'
          ? t('dashboard.buy_subscription_method_bank_card_desc')
          : id === 'sbp'
            ? t('dashboard.buy_subscription_method_sbp_desc')
            : t('dashboard.buy_subscription_method_yoomoney_desc'),
    }));

    return (
      <div className={styles.wrapper}>
        <Card padding="medium" className={styles.card}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={handleGoBack}>
              <ArrowLeft size={16} />
              <span>{t('dashboard.buy_subscription_return_to_payment_methods')}</span>
            </button>
            <SectionHeader
              title={t('dashboard.buy_subscription_method_title')}
              subtitle={t('dashboard.buy_subscription_method_hint')}
            />
          </div>

          <div className={styles.providerList}>
            {yookassaMethods.map((m) => (
              <button
                key={m.id}
                className={styles.providerBtn}
                onClick={() => startPayment('yookassa', m.id)}
              >
                <div className={styles.providerContent}>
                  <div className={styles.providerIcon}>
                    <img src={m.icon} alt="" className={styles.providerImage} />
                  </div>
                  <div className={styles.providerText}>
                    <span className={styles.providerLabel}>{m.label}</span>
                    <span className={styles.providerDesc}>{m.desc}</span>
                  </div>
                </div>
                <ChevronRight size={20} className={styles.providerChevron} />
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (stage === 'selecting_method') {
    const providers = providersData?.providers ?? [];

    return (
      <div className={styles.wrapper}>
        <Card padding="medium" className={styles.card}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={handleGoBack}>
              <ArrowLeft size={16} />
              <span>{t('dashboard.buy_subscription_return_to_plans')}</span>
            </button>
            <SectionHeader
              title={t('dashboard.buy_subscription_method_title')}
              subtitle={t('dashboard.buy_subscription_method_hint')}
            />
          </div>

          <div className={styles.providerList}>
            {providersLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} height={74} borderRadius={12} />
                ))
              : providers.map((p) => {
                  const providerKey = p.toLowerCase();
                  const isYookassa = providerKey === 'yookassa';
                  const isCrypto = providerKey.includes('crypto');
                  const Icon = PAYMENT_METHOD_ICONS[providerKey] ?? PAYMENT_METHOD_ICONS.default;

                  const label = isYookassa
                    ? t('dashboard.buy_subscription_method_yookassa')
                    : isCrypto
                      ? t('dashboard.buy_subscription_method_cryptopay')
                      : p;

                  const desc = isYookassa
                    ? t('dashboard.buy_subscription_method_yookassa_desc')
                    : isCrypto
                      ? t('dashboard.buy_subscription_method_cryptopay_desc')
                      : '';

                  return (
                    <button
                      key={p}
                      className={styles.providerBtn}
                      onClick={() => handleSelectProvider(p)}
                      disabled={createIntentMutation.isPending}
                    >
                      <div className={styles.providerContent}>
                        <div className={styles.providerIcon}>
                          {isYookassa ? (
                            <img src={YookassaIcon} alt="" className={styles.providerImage} />
                          ) : (
                            <Icon size={24} />
                          )}
                        </div>
                        <div className={styles.providerText}>
                          <span className={styles.providerLabel}>{label}</span>
                          {desc && <span className={styles.providerDesc}>{desc}</span>}
                        </div>
                      </div>
                      <ChevronRight size={20} className={styles.providerChevron} />
                    </button>
                  );
                })}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.cardStack}>
        <Card padding="medium" className={styles.card}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={handleGoBack}>
              <ArrowLeft size={16} />
              <span>{t('shared.back')}</span>
            </button>
            <SectionHeader
              title={
                isRenewal
                  ? t('dashboard.buy_subscription_renew')
                  : t('dashboard.buy_subscription_title')
              }
              subtitle={t('dashboard.buy_subscription_step_title')}
            />
          </div>

          <div className={styles.container}>
            {plansLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={70} borderRadius={12} />
              ))
            ) : plans && plans.length > 0 ? (
              plans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                const isBestValue = plan.label === 'BEST_VALUE';
                const isHot = plan.label === 'HOT';
                const monthsLabel = formatPlanDurationLabel(plan.durationDays, monthLabels);
                const currentPlanMonths = Math.max(1, Math.round(plan.durationDays / 30));
                const monthlyLabel = formatPerMonthLabel(
                  Math.round(plan.priceCents / currentPlanMonths),
                  plan.currency ?? 'RUB',
                  locale,
                  t('shared.per_month_suffix'),
                );

                const itemClasses = [
                  styles.item,
                  isSelected ? styles.itemSelected : '',
                  isBestValue ? styles.itemBestValue : '',
                  isHot ? styles.itemHot : '',
                ].join(' ');

                return (
                  <button
                    key={plan.id}
                    type="button"
                    className={itemClasses}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <div className={styles.itemMain}>
                      <div className={styles.itemTop}>
                        <div className={styles.itemLabelGroup}>
                          <div className={styles.itemName}>{monthsLabel}</div>
                          {isHot && <Flame size={18} className={styles.hotIcon} />}
                          {isBestValue && (
                            <span className={`${styles.badge} ${styles.bestValueBadge}`}>
                              {t('dashboard.buy_subscription_best_value_badge')}
                            </span>
                          )}
                        </div>
                        <div className={styles.itemName}>
                          {formatCurrency(plan.priceCents, plan.currency ?? 'RUB', locale)}
                        </div>
                      </div>

                      <div className={styles.itemMeta}>
                        <span>
                          {plan.maxDevices} {t('landing.devices_count')}
                        </span>
                        <span>•</span>
                        <span>{monthlyLabel}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className={styles.emptyText}>{t('dashboard.buy_subscription_empty')}</div>
            )}
          </div>
        </Card>

        {selectedPlan && (
          <div className={styles.summaryMinimal}>
            <div className={styles.summaryIcon}>
              <Calendar size={18} />
            </div>
            <div className={styles.summaryText}>
              <span>
                {isRenewal
                  ? t('dashboard.buy_subscription_renew_to')
                  : t('dashboard.buy_subscription_active_until')}
                :
              </span>
              <strong>{newExpiryDate ? formatDate(newExpiryDate.toISOString()) : '-'}</strong>
            </div>
          </div>
        )}

        <Card padding="medium" className={styles.paymentCard}>
          <Button
            className={styles.modalLink}
            onClick={handleContinueToPayment}
            disabled={!selectedPlan || plansLoading}
          >
            {isRenewal
              ? t('dashboard.buy_subscription_renew')
              : t('dashboard.buy_subscription_continue')}
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default SubscriptionBuyPage;
