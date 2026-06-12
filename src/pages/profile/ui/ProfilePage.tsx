import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Loader2, MonitorSmartphone } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useDevicesQuery } from '@/entities/device';
import { useSubscriptionsQuery } from '@/entities/subscription';
import { copyToClipboard, useUIStore } from '@/shared/lib';
import { Button, Card, SectionHeader } from '@/shared/ui';
import { SubscriptionCard } from './SubscriptionCard';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useUIStore();
  const { data: devices, isLoading: devicesLoading } = useDevicesQuery(!!user);
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptionsQuery(!!user);

  const devicePreview = devices?.slice(0, 3) ?? [];
  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;

  if (!user) return null;

  const handleCopySubscription = async () => {
    if (!activeSubscription?.remnaSubLink) return;

    const success = await copyToClipboard(activeSubscription.remnaSubLink);
    if (success) {
      showToast(t('profile.copied'), 'success');
    }
  };

  return (
    <div className={`${styles.wrapper} container`}>
      <Card padding="medium" className={styles.heroCard}>
        <div className={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
        <div className={styles.profileMeta}>
          <div className={styles.username}>{user.username}</div>
          <div className={styles.profileSubtitle}>{user.email || t('dashboard.email_not_set')}</div>
        </div>
      </Card>

      <Card padding="medium" className={styles.card}>
        {subscriptionsLoading ? (
          <div className={styles.emptyState}>
            <Loader2 className={styles.spinner} />
          </div>
        ) : activeSubscription ? (
          <>
            <SubscriptionCard
              subscription={activeSubscription}
              onCopyLink={handleCopySubscription}
            />
            <Button
              type="button"
              variant="secondary"
              className={styles.devicesBtn}
              onClick={() => navigate('/pay')}
            >
              {t('dashboard.renew_subscription', 'Продлить подписку')}
            </Button>
          </>
        ) : (
          <>
            <SectionHeader
              title={t('dashboard.subscriptions')}
              subtitle={t('dashboard.no_subscriptions')}
              className={styles.header}
            />
            <div className={styles.subscriptionEmpty}>
              <div className={styles.emptyState}>{t('dashboard.no_subscriptions')}</div>
              <Button type="button" className={styles.devicesBtn} onClick={() => navigate('/pay')}>
                {t('dashboard.purchase_subscription')}
              </Button>
            </div>
          </>
        )}
      </Card>

      <Card padding="medium" className={styles.card}>
        <SectionHeader
          title={t('devices.title')}
          subtitle={t('devices.subtitle')}
          className={styles.header}
        />

        <div className={styles.container}>
          {devicesLoading ? (
            <div className={styles.emptyState}>
              <Loader2 className={styles.spinner} />
            </div>
          ) : devicePreview.length > 0 ? (
            devicePreview.map((device) => (
              <div key={device.id} className={styles.item}>
                <div className={styles.itemContent}>
                  <div className={styles.itemName}>{device.name}</div>
                  <div className={styles.itemStatus}>{device.lastSeen}</div>
                </div>
                <ChevronRight size={22} className={styles.itemChevron} />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>{t('devices.empty')}</div>
          )}
        </div>

        <Button
          type="button"
          variant="secondary"
          className={styles.devicesBtn}
          onClick={() => navigate('/my/devices')}
        >
          <MonitorSmartphone size={22} />
          {t('dashboard.sidebar_devices')}
        </Button>
      </Card>
    </div>
  );
}

export default ProfilePage;
