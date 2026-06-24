import { useTranslation } from 'react-i18next';
import { ChevronRight, MonitorSmartphone } from 'lucide-react';
import { SOCIAL_LINKS } from '@/constants/social';
import { getDeviceIcon, getDeviceTypeLabel } from '@/shared/lib';
import { Button, Card, SectionHeader } from '@/shared/ui';
import { DeviceCardSkeleton, SubscriptionCardSkeleton } from '@/shared/ui/Skeleton';
import { useProfilePage } from '../model/useProfilePage';
import { SubscriptionCard } from './SubscriptionCard';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { t } = useTranslation();
  const profile = useProfilePage();
  const showHelpBanner = !!profile.activeSubscription;
  const devicesSubtitle =
    profile.deviceAvailability?.remaining !== null &&
    profile.deviceAvailability?.remaining !== undefined &&
    profile.deviceAvailability?.limit
      ? t('profile.devices_available_count', {
          count: profile.deviceAvailability.remaining,
          limit: profile.deviceAvailability.limit,
        })
      : t('devices.subtitle');

  if (!profile.user) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.desktopGrid}>
        <div className={styles.mainColumn}>
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

          {showHelpBanner ? (
            <a className={styles.bannerLink} href={SOCIAL_LINKS.TG_CHANNEL} target="_blank" rel="noreferrer">
              <Card padding="medium" className={styles.bannerCard}>
                <div className={styles.bannerContent}>
                  <div className={styles.bannerText}>
                    <span className={styles.bannerTitle}>Нужна помощь?</span>
                    <span className={styles.bannerSubtitle}>
                      Подключение и настройка в Telegram за пару кликов.
                    </span>
                  </div>
                  <div className={styles.bannerMeta}>TG</div>
                </div>
              </Card>
            </a>
          ) : null}

          <Card padding="medium" className={styles.card}>
            <SectionHeader
              title={t('devices.title')}
              subtitle={devicesSubtitle}
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
              size="small"
              className={styles.devicesBtn}
              onClick={profile.goToDevices}
            >
              <MonitorSmartphone size={22} />
              {t('dashboard.sidebar_devices')}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
