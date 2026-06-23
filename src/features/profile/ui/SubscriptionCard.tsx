import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, MetricRow } from '@/shared/ui';
import { formatDate, formatTraffic } from '@/shared/lib';
import type { SubscriptionResponse as Subscription } from '@/shared/api';
import styles from './SubscriptionCard.module.css';

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
      </div>

      <Button type="button" variant="secondary" className={styles.devicesBtn} onClick={onCopyLink}>
        <Copy size={22} />
        {t('dashboard.copy_subscription_link')}
      </Button>
    </div>
  );
}
