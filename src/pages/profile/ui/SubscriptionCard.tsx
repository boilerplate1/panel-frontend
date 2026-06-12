import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, MetricRow } from '@/shared/ui';
import { formatDate, formatTraffic } from '@/shared/lib';
import type { Subscription } from '@/entities/subscription';
import styles from './ProfilePage.module.css';

interface SubscriptionCardProps {
  subscription: Subscription;
  onCopyLink: () => void;
}

export function SubscriptionCard({ subscription, onCopyLink }: SubscriptionCardProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.subscriptionCard}>
      <div className={styles.subscriptionTop}>
        <div className={styles.subscriptionPlan}>
          <strong>{t('profile.my_subscription')}</strong>
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
        {subscription.deviceAvailability && (
          <div className={styles.subscriptionMetric}>
            <span>{t('dashboard.buy_subscription_summary_devices')}</span>
            <div className={styles.deviceProgress}>
              <div
                className={`${styles.deviceBar} ${subscription.deviceAvailability.isFull ? styles.deviceBarFull : ''}`}
                style={{
                  width: `${(subscription.deviceAvailability.used / subscription.deviceAvailability.limit) * 100}%`,
                }}
              />
            </div>
            <strong>
              {subscription.deviceAvailability.used} / {subscription.deviceAvailability.limit}{' '}
              {t('landing.devices_count')}
            </strong>
          </div>
        )}
      </div>

      <Button type="button" variant="secondary" className={styles.devicesBtn} onClick={onCopyLink}>
        <Copy size={22} />
        {t('dashboard.copy_subscription_link')}
      </Button>
    </div>
  );
}
