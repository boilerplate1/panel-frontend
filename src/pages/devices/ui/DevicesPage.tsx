import { useAuth } from '@/features/auth';
import { Card, SectionHeader, Dropdown, Modal, Button, FormField } from '@/shared/ui';
import { Loader2, MoreVertical, Edit2, Trash2, Smartphone, Monitor, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DevicesPage.module.css';
import { useDevicesQuery, useUpdateDeviceMutation, useRemoveDeviceMutation } from '@/entities/device';
import { useState } from 'react';

function DevicesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: devices, isLoading } = useDevicesQuery(!!user);
  const updateDeviceMutation = useUpdateDeviceMutation();
  const removeDeviceMutation = useRemoveDeviceMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

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

  const handleDelete = async (id: string) => {
    if (window.confirm(t('devices.confirm_delete'))) {
      await removeDeviceMutation.mutateAsync(id);
    }
  };

  const getDeviceIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('ios') || t.includes('android') || t.includes('phone')) return <Smartphone size={18} />;
    if (t.includes('windows') || t.includes('macos') || t.includes('desktop')) return <Monitor size={18} />;
    return <Globe size={18} />;
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
            {devices && devices.length > 0 ? (
              devices.map((device) => (
                <div key={device.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{device.name}</div>
                    <div className={styles.itemStatus}>
                      {getDeviceIcon(device.type)}
                      <span>{device.type}</span>
                      <span>•</span>
                      <span>{t('devices.last_seen')} {new Date(device.lastSeen).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <Dropdown
                      showChevron={false}
                      trigger={
                        <div className={styles.dropdownTrigger}>
                          <MoreVertical size={20} />
                        </div>
                      }
                      items={[
                        {
                          label: t('common.rename'),
                          icon: <Edit2 size={16} />,
                          onClick: () => handleStartEdit(device.id, device.name),
                        },
                        {
                          label: t('common.delete'),
                          icon: <Trash2 size={16} />,
                          onClick: () => handleDelete(device.id),
                          variant: 'danger',
                        },
                      ]}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>{t('devices.empty')}</p>
            )}
          </div>
        )}
      </Card>

      <Modal
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        title={t('common.rename')}
      >
        <div className={styles.modalContent}>
          <FormField
            autoFocus
            label={t('devices.name_label', 'Название устройства')}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
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
              {updateDeviceMutation.isPending ? <Loader2 className={styles.spinner} size={18} /> : t('common.save')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DevicesPage;
