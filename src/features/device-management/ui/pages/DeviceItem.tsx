import { Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDeviceTypeLabel } from '@/shared/lib';
import styles from './DeviceItem.module.css';

interface DeviceItemProps {
  device: { id: string; type: string; name: string; status: string; lastSeen: string };
  dataUpdatedAt: number;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function DeviceItem({ device, dataUpdatedAt, onEdit, onDelete }: DeviceItemProps) {
  const { t } = useTranslation();

  const isOnline =
    device.status === 'active' ||
    dataUpdatedAt - new Date(device.lastSeen).getTime() < 5 * 60 * 1000;

  const label = getDeviceTypeLabel(device.type);
  const hasCustomName =
    device.name.toLowerCase() !== device.type.toLowerCase() && device.name !== label;

  return (
    <div className={styles.item}>
      <div className={styles.itemMain}>
        <div className={styles.itemName}>{hasCustomName ? device.name : label}</div>
        <div className={styles.itemStatus}>
          <span
            className={`${styles.statusPill} ${isOnline ? styles.statusOnline : styles.statusOffline}`}
          >
            {isOnline ? t('devices.online') : t('devices.offline')}
          </span>
          {!hasCustomName && <span className={styles.typeLabel}>{label}</span>}
        </div>
      </div>

      <div className={styles.itemActions}>
        <button
          className={styles.actionBtn}
          onClick={() => onEdit(device.id, device.name)}
          type="button"
          title={t('common.rename')}
        >
          <Edit2 size={18} />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionDanger}`}
          onClick={() => onDelete(device.id)}
          type="button"
          title={t('common.delete')}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
