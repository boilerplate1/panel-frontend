import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import { Card, SectionHeader, ResponsiveModal, Button, Pagination } from '@/shared/ui';
import { Loader2 } from 'lucide-react';
import { useDevicesQuery, useUpdateDeviceMutation, useRemoveDeviceMutation } from '@/shared/api';

import { DeviceItem } from './DeviceItem';
import { RenameDeviceModal } from './DeviceRename';
import styles from './DevicesPage.module.css';

function DevicesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data: paginated, isLoading, dataUpdatedAt } = useDevicesQuery(!!user, page);
  const updateDeviceMutation = useUpdateDeviceMutation();
  const removeDeviceMutation = useRemoveDeviceMutation();

  const [editingDevice, setEditingDevice] = useState<{ id: string; name: string } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (!user) return null;

  const devices = paginated?.items ?? [];
  const totalPages = paginated?.totalPages ?? 0;

  const handleSaveEdit = async (newName: string) => {
    if (!editingDevice) return;
    try {
      await updateDeviceMutation.mutateAsync({ id: editingDevice.id, name: newName });
      setEditingDevice(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await removeDeviceMutation.mutateAsync(deleteTargetId);
      setDeleteTargetId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <SectionHeader title={t('devices.title')} subtitle={t('devices.subtitle')} className={styles.header} />

        {isLoading ? (
          <div className={styles.loading}><Loader2 className={styles.spinner} /></div>
        ) : (
          <div className={styles.container}>
            {devices.length > 0 ? (
              devices.map((device) => (
                <DeviceItem
                  key={device.id}
                  device={device}
                  dataUpdatedAt={dataUpdatedAt}
                  onEdit={(id, name) => setEditingDevice({ id, name })}
                  onDelete={(id) => setDeleteTargetId(id)}
                />
              ))
            ) : (
              <p className={styles.emptyText}>{t('devices.empty')}</p>
            )}
          </div>
        )}

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
      </Card>

      <ResponsiveModal isOpen={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} title={t('devices.confirm_delete_title', 'Delete device')}>
        <div className={styles.modalContent}>
          <p>{t('devices.confirm_delete')}</p>
          <div className={styles.modalActions}>
            <Button variant="outline" onClick={() => setDeleteTargetId(null)}>{t('common.cancel')}</Button>
            <Button variant="danger" onClick={handleDeleteConfirm} disabled={removeDeviceMutation.isPending}>
              {removeDeviceMutation.isPending ? <Loader2 className={styles.spinner} size={18} /> : t('common.delete')}
            </Button>
          </div>
        </div>
      </ResponsiveModal>

      <RenameDeviceModal
        isOpen={!!editingDevice}
        onClose={() => setEditingDevice(null)}
        currentName={editingDevice?.name ?? ''}
        isPending={updateDeviceMutation.isPending}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default DevicesPage;