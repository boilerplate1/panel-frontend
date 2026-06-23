import { useAuth } from '@/features/auth';
import { Card, SectionHeader, ResponsiveModal, Button, FormField, Pagination } from '@/shared/ui';
import { Loader2, Edit2, Trash2, Smartphone, Monitor, Globe, Tv } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DevicesPage.module.css';
import { useDevicesQuery, useUpdateDeviceMutation, useRemoveDeviceMutation } from '@/shared/api';
import { useState } from 'react';

function DevicesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data: paginated, isLoading, dataUpdatedAt } = useDevicesQuery(!!user, page);
  const updateDeviceMutation = useUpdateDeviceMutation();
  const removeDeviceMutation = useRemoveDeviceMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const devices = paginated?.items ?? [];
  const totalPages = paginated?.totalPages ?? 0;

  if (!user) return null;

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = async () => {
    if (editingId && editName.trim()) {
      await updateDeviceMutation.mutateAsync({ id: editingId, name: editName.trim() });
      setEditingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await removeDeviceMutation.mutateAsync(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const getDeviceIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('ios') || t.includes('android') || t.includes('phone'))
      return <Smartphone size={18} />;
    if (
      t.includes('windows') ||
      t.includes('macos') ||
      t.includes('desktop') ||
      t.includes('laptop') ||
      t.includes('computer')
    )
      return <Monitor size={18} />;
    if (t.includes('tv') || t.includes('television') || t.includes('smarttv'))
      return <Tv size={18} />;
    return <Globe size={18} />;
  };

  const getDeviceTypeLabel = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('ios')) return 'iOS';
    if (t.includes('android')) return 'Android';
    if (t.includes('windows')) return 'Windows';
    if (t.includes('macos')) return 'macOS';
    if (t.includes('linux')) return 'Linux';
    if (t.includes('desktop') || t.includes('computer')) return 'Desktop';
    if (t.includes('laptop')) return 'Laptop';
    if (t.includes('tv')) return 'TV';
    if (t.includes('phone')) return 'Phone';
    if (t.includes('tablet')) return 'Tablet';
    return type;
  };

  const isDeviceOnline = (device: { status: string; lastSeen: string }) => {
    if (device.status === 'active') return true;
    const diff = dataUpdatedAt - new Date(device.lastSeen).getTime();
    return diff < 5 * 60 * 1000;
  };

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
            {devices.length > 0 ? (
              devices.map((device) => (
                <div key={device.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{getDeviceTypeLabel(device.type)}</div>
                    <div className={styles.itemStatus}>
                      <span className={styles.deviceIcon}>{getDeviceIcon(device.type)}</span>
                      {device.name.toLowerCase() !== device.type.toLowerCase() &&
                        device.name !== getDeviceTypeLabel(device.type) && (
                          <span className={styles.rawName}>{device.name}</span>
                        )}
                      <span
                        className={`${styles.onlineDot} ${isDeviceOnline(device) ? styles.online : styles.offline}`}
                      />
                      <span
                        className={isDeviceOnline(device) ? styles.onlineText : styles.offlineText}
                      >
                        {isDeviceOnline(device) ? t('devices.online') : t('devices.offline')}
                      </span>
                      <span className={styles.lastSeen}>
                        {!isDeviceOnline(device) && (
                          <>
                            {t('devices.last_seen')} {new Date(device.lastSeen).toLocaleString()}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleStartEdit(device.id, device.name)}
                      type="button"
                      title={t('common.rename')}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.actionDanger}`}
                      onClick={() => setDeleteTargetId(device.id)}
                      type="button"
                      title={t('common.delete')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>{t('devices.empty')}</p>
            )}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </Card>

      <ResponsiveModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title={t('devices.confirm_delete_title', 'Delete device')}
      >
        <div className={styles.modalContent}>
          <p>{t('devices.confirm_delete')}</p>
          <div className={styles.modalActions}>
            <Button variant="outline" onClick={() => setDeleteTargetId(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={removeDeviceMutation.isPending}
            >
              {removeDeviceMutation.isPending ? (
                <Loader2 className={styles.spinner} size={18} />
              ) : (
                t('common.delete')
              )}
            </Button>
          </div>
        </div>
      </ResponsiveModal>

      <ResponsiveModal
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        title={t('common.rename')}
      >
        <div className={styles.modalContent}>
          <FormField
            autoFocus
            label={t('devices.name_label')}
            hint={t('devices.name_example')}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            maxLength={50}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') setEditingId(null);
            }}
          />
          <div className={styles.modalActions}>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editName.trim() || updateDeviceMutation.isPending}
            >
              {updateDeviceMutation.isPending ? (
                <Loader2 className={styles.spinner} size={18} />
              ) : (
                t('common.save')
              )}
            </Button>
          </div>
        </div>
      </ResponsiveModal>
    </div>
  );
}

export default DevicesPage;
