import { useTranslation } from 'react-i18next';
import { ChevronRight, MonitorSmartphone } from 'lucide-react';
import { getDeviceIcon, getDeviceTypeLabel } from '@/shared/lib';
import { Button, Card, SectionHeader } from '@/shared/ui';
import { DeviceCardSkeleton, SubscriptionCardSkeleton } from '@/shared/ui/Skeleton';
import { useProfilePage } from '../model/useProfilePage';
import { SubscriptionCard } from './SubscriptionCard';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { t } = useTranslation();
  const profile = useProfilePage();

  if (!profile.user) return null;

  return (
    <div className={styles.wrapper}>
      {profile.dashboardBanner ? (
        <Card padding="medium" className={styles.banner}>
          <div className={styles.bannerText}>
            <strong>{profile.dashboardBanner.title}</strong>
            <span>{profile.dashboardBanner.description}</span>
          </div>
          {profile.dashboardBanner.actionLabel && profile.dashboardBanner.onAction ? (
            <Button type="button" variant="secondary" onClick={profile.dashboardBanner.onAction}>
              {profile.dashboardBanner.actionLabel}
            </Button>
          ) : null}
        </Card>
      ) : null}

      <div className={styles.overviewGrid}>
        <Card padding="medium" className={styles.identityCard}>
          <div className={styles.accountHeader}>
            <div className={styles.avatar}>{profile.user.username.charAt(0).toUpperCase()}</div>
            <div className={styles.accountIdentity}>
              <div className={styles.username}>{profile.user.username}</div>
              <div className={styles.profileSubtitle}>
                {profile.user.email || t('dashboard.email_not_set')}
              </div>
            </div>
          </div>
        </Card>

        <Card padding="medium" className={styles.subscriptionCard}>
          {profile.subscriptionsLoading ? (
            <SubscriptionCardSkeleton />
          ) : (
            <SubscriptionCard
              subscription={profile.activeSubscription}
              daysLeft={profile.subscriptionDaysLeft}
              state={profile.subscriptionState}
              onCopyLink={profile.copySubscriptionLink}
              onRenew={profile.goToPayment}
            />
          )}
        </Card>
      </div>

      <Card padding="medium" className={styles.card}>
        <SectionHeader
          title={t('devices.title')}
          subtitle={t('devices.subtitle')}
          className={styles.header}
        />

        <div className={styles.container}>
          {profile.devicesLoading ? (
            <>
              <DeviceCardSkeleton />
              <DeviceCardSkeleton />
            </>
          ) : profile.devicePreview.length > 0 ? (
            profile.devicePreview.map((device) => (
              <div
                key={device.id}
                className={styles.item}
                onClick={profile.goToDevices}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.itemIconWrapper}>{getDeviceIcon(device.type)}</div>
                <div className={styles.itemContent}>
                  <div className={styles.itemName}>{device.name}</div>
                  <div className={styles.itemStatus}>
                    {getDeviceTypeLabel(device.type)} - {t('devices.last_seen')}{' '}
                    {new Date(device.lastSeen).toLocaleString()}
                  </div>
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
          onClick={profile.goToDevices}
        >
          <MonitorSmartphone size={22} />
          {t('dashboard.sidebar_devices')}
        </Button>
      </Card>
    </div>
  );
}

export default ProfilePage;
