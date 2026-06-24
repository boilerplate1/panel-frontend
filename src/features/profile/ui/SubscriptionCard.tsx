import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, Button, MetricRow } from '@/shared/ui';
import { formatDate, formatTraffic } from '@/shared/lib';
import type { SubscriptionResponse as Subscription } from '@/shared/api';
import type { SubscriptionState } from '../lib/profileSummary';
import styles from './SubscriptionCard.module.css';

interface SubscriptionCardProps {
  subscription: Subscription | null;
  daysLeft: number | null;
  state: SubscriptionState;
  onCopyLink: () => void;
  onRenew: () => void;
}

export function SubscriptionCard({
  subscription,
  daysLeft,
  state,
  onCopyLink,
  onRenew,
}: SubscriptionCardProps) {
  const { t } = useTranslation();
  const isInactive = state === 'inactive';
  const stateLabel = isInactive
    ? t('profile.subscription_inactive')
    : state === 'expiring'
      ? t('profile.subscription_expiring')
      : t('profile.subscription_active');

  return (
    <div className={styles.subscriptionCard}>
      <div className={styles.subscriptionTop}>
        <strong className={styles.subscriptionTitle}>{t('profile.my_subscription')}</strong>
        <Badge
          variant={isInactive ? 'danger' : state === 'expiring' ? 'warning' : 'success'}
          className={styles.statusBadge}
        >
          {stateLabel}
        </Badge>
      </div>

      {subscription ? (
        <>
          <div className={styles.progressBlock}>
            <div className={styles.progressHeader}>
              <span>{t('profile.days_left')}</span>
              <strong>
                {daysLeft !== null ? t('profile.days_count', { count: daysLeft }) : '-'}
              </strong>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressBar}
                style={{ width: `${Math.max(8, Math.min(100, ((daysLeft ?? 0) / 30) * 100))}%` }}
              />
            </div>
          </div>

          <div className={styles.subscriptionGrid}>
            <MetricRow label={t('dashboard.expires')} value={formatDate(subscription.expiresAt)} />
            <MetricRow
              label={t('dashboard.traffic')}
              value={formatTraffic(
                subscription.trafficUsed,
                subscription.trafficTotal,
                t('shared.unlimited'),
              )}
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              size="small"
              className={styles.actionBtn}
              onClick={onCopyLink}
            >
              <Copy size={20} />
              {t('dashboard.copy_subscription_link')}
            </Button>
            <Button type="button" size="small" className={styles.actionBtn} onClick={onRenew}>
              {t('dashboard.renew_subscription')}
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.emptySubscription}>
          <p>{t('dashboard.no_subscriptions')}</p>
          <Button type="button" size="small" className={styles.actionBtn} onClick={onRenew}>
            {t('dashboard.purchase_subscription')}
          </Button>
        </div>
      )}
    </div>
  );
}
