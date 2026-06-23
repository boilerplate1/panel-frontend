import { ArrowLeft, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SubscriptionPlanResponse } from '@/shared/api/generated';
import { Button, Card, SectionHeader, Skeleton } from '@/shared/ui';
import {
  formatCurrency,
  formatDate,
  formatPerMonthLabel,
  formatPlanDurationLabel,
  type MonthLabels,
} from '@/shared/lib';
import styles from './PlanSelectionStep.module.css';

interface PlanSelectionStepProps {
  plans?: SubscriptionPlanResponse[];
  isLoading: boolean;
  selectedPlan: SubscriptionPlanResponse | null;
  bestValuePlanId: number | null;
  isRenewal: boolean;
  newExpiryDate: Date | null;
  locale: string;
  monthLabels: MonthLabels;
  onBack: () => void;
  onSelectPlan: (planId: number) => void;
  onContinue: () => void;
}

export function PlanSelectionStep({
  plans,
  isLoading,
  selectedPlan,
  bestValuePlanId,
  isRenewal,
  newExpiryDate,
  locale,
  monthLabels,
  onBack,
  onSelectPlan,
  onContinue,
}: PlanSelectionStepProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.cardStack}>
        <Card padding="medium" className={styles.card}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={onBack}>
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
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={70} borderRadius={12} />
              ))
            ) : plans && plans.length > 0 ? (
              plans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                const isBestValue = plan.id === bestValuePlanId;
                const isHot = plan.label === 'HOT';
                const monthsLabel = formatPlanDurationLabel(plan.durationDays, monthLabels);
                const currentPlanMonths = Math.max(1, Math.round(plan.durationDays / 30));
                const monthlyLabel = formatPerMonthLabel(
                  Math.round(plan.priceCents / currentPlanMonths),
                  plan.currency ?? 'RUB',
                  locale,
                  t('shared.per_month_suffix'),
                );
                const itemClasses = [styles.item, isSelected ? styles.itemSelected : ''].join(' ');

                return (
                  <button
                    key={plan.id}
                    type="button"
                    className={itemClasses}
                    onClick={() => onSelectPlan(plan.id)}
                  >
                    <div className={styles.itemMain}>
                      <div className={styles.itemTop}>
                        <div className={styles.itemLabelGroup}>
                          <div className={styles.itemName}>{monthsLabel}</div>
                          {isHot ? (
                            <span className={`${styles.badge} ${styles.hotBadge}`}>
                              {t('dashboard.buy_subscription_hot')}
                            </span>
                          ) : null}
                          {isBestValue ? (
                            <span className={`${styles.badge} ${styles.bestValueBadge}`}>
                              {t('dashboard.buy_subscription_best_value_badge')}
                            </span>
                          ) : null}
                        </div>
                        <div className={styles.itemName}>
                          {formatCurrency(plan.priceCents, plan.currency ?? 'RUB', locale)}
                        </div>
                      </div>

                      <div className={styles.itemMeta}>
                        <span>
                          {plan.maxDevices} {t('landing.devices_count')}
                        </span>
                        <span aria-hidden="true">·</span>
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

        {selectedPlan ? (
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
        ) : null}

        <Card padding="medium" className={styles.paymentCard}>
          <Button
            className={styles.modalLink}
            onClick={onContinue}
            disabled={!selectedPlan || isLoading}
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
