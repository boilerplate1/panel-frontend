import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Card, Pagination, SectionHeader } from '@/shared/ui';
import { useDevicesPage } from '../../model/useDevicesPage';
import { DeviceDeleteModal } from '../modals/DeviceDeleteModal';
import { DeviceRenameModal } from '../modals/DeviceRenameModal';
import { DeviceItem } from './DeviceItem';
import styles from './DevicesPage.module.css';

function DevicesPage() {
  const { t } = useTranslation();
  const devicesPage = useDevicesPage();

  if (!devicesPage.user) return null;

  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <SectionHeader
          title={t('devices.title')}
          subtitle={t('devices.subtitle')}
          className={styles.header}
        />

        {devicesPage.isLoading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} />
          </div>
        ) : (
          <div className={styles.container}>
            {devicesPage.devices.length > 0 ? (
              devicesPage.devices.map((device) => (
                <DeviceItem
                  key={device.id}
                  device={device}
                  dataUpdatedAt={devicesPage.dataUpdatedAt}
                  onEdit={devicesPage.editDevice}
                  onDelete={devicesPage.requestDelete}
                />
              ))
            ) : (
              <p className={styles.emptyText}>{t('devices.empty')}</p>
            )}
          </div>
        )}

        {devicesPage.totalPages > 1 && (
          <Pagination
            page={devicesPage.page}
            totalPages={devicesPage.totalPages}
            onChange={devicesPage.setPage}
          />
        )}
      </Card>

      <DeviceDeleteModal
        isOpen={!!devicesPage.deleteTargetId}
        onClose={devicesPage.closeDeleteModal}
        onConfirm={devicesPage.confirmDelete}
        isPending={devicesPage.isRemovingDevice}
      />

      <DeviceRenameModal
        isOpen={!!devicesPage.editingDevice}
        onClose={devicesPage.closeEditModal}
        currentName={devicesPage.editingDevice?.name ?? ''}
        isPending={devicesPage.isUpdatingDevice}
        onSave={devicesPage.saveDeviceName}
      />
    </div>
  );
}

export default DevicesPage;
