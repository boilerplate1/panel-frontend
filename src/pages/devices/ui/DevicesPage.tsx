import { useAuth } from '@/features/auth';
import { Card, SectionHeader } from '@/shared/ui';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DevicesPage.module.css';
import { useDevicesQuery } from '@/entities/device';

function DevicesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: devices, isLoading } = useDevicesQuery(!!user);

  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <SectionHeader
          title={t('devices.title')}
          subtitle={t('devices.subtitle')}
          className={styles.header}
        />

        {isLoading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} />
          </div>
        ) : (
          <div className={styles.container}>
            {devices && devices.length > 0 ? (
              devices.map((device) => (
                <div key={device.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{device.name}</div>
                    <div className={styles.itemStatus}>{device.lastSeen}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>{t('devices.empty')}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default DevicesPage;
