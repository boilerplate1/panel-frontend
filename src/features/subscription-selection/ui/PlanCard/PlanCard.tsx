import { Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { formatCurrency, formatPlanDurationLabel } from '@/shared/lib';
import type { SubscriptionPlan } from '@/entities/subscription/model/types';
import { isBestValuePlan } from '../../lib/helpers';
import styles from './PlanCard.module.css';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onAction?: (plan: SubscriptionPlan) => void;
  onClick?: () => void;
  actionLabel?: string;
  variant?: 'default' | 'selected';
  className?: string;
}

export const PlanCard = ({
  plan,
  onAction,
  onClick,
  actionLabel,
  variant = 'default',
  className,
}: PlanCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';
  const isBestValue = isBestValuePlan(plan.durationDays);
  const isHot = plan.label?.toUpperCase() === 'HOT';
  const isHighlighted = isBestValue || plan.label?.toUpperCase() === 'BEST_VALUE';

  const monthLabels = {
    singular: t('shared.month_1'),
    plural1: t('shared.month_2'),
    plural2: t('shared.month_5'),
  };

  const rootClassName = `${styles.root} ${isHighlighted ? styles.bestValue : ''} ${variant === 'selected' ? styles.selected : ''} ${className || ''} stagger-item`;

  if (onAction) {
    return (
      <div className={rootClassName}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.name}>
              {formatPlanDurationLabel(plan.durationDays, monthLabels)}
            </div>
            {isHot && <Flame size={18} className={styles.hotIcon} />}
            {isHighlighted && (
              <div className={styles.badge}>{t('dashboard.buy_subscription_best_value_badge')}</div>
            )}
          </div>
          <div className={styles.price}>
            {formatCurrency(plan.priceCents, plan.currency ?? 'RUB', locale)}
          </div>
          <div className={styles.features}>
            <div className={styles.feature}>
              {plan.maxDevices} {t('landing.devices_count')}
            </div>
            <div className={styles.feature}>
              {isHighlighted ? t('landing.dedicated_locations') : t('landing.optimal_locations')}
            </div>
            <div className={styles.feature}>{t('landing.unlimited')}</div>
          </div>
        </div>
        <Button
          onClick={() => onAction(plan)}
          variant={isHighlighted ? 'primary' : 'outline'}
          className={styles.actionBtn}
        >
          {actionLabel || t('landing.subscribe')}
        </Button>
      </div>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rootClassName}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.name}>
            {formatPlanDurationLabel(plan.durationDays, monthLabels)}
          </div>
          {isHot && <Flame size={18} className={styles.hotIcon} />}
          {isHighlighted && (
            <div className={styles.badge}>{t('dashboard.buy_subscription_best_value_badge')}</div>
          )}
        </div>
        <div className={styles.price}>
          {formatCurrency(plan.priceCents, plan.currency ?? 'RUB', locale)}
        </div>
        <div className={styles.features}>
          <div className={styles.feature}>
            {plan.maxDevices} {t('landing.devices_count')}
          </div>
          <div className={styles.feature}>
            {isHighlighted ? t('landing.dedicated_locations') : t('landing.optimal_locations')}
          </div>
          <div className={styles.feature}>{t('landing.unlimited')}</div>
        </div>
      </div>
    </button>
  );
};
