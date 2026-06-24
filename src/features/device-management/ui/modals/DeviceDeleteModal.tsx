import { useTranslation } from 'react-i18next';
import { ResponsiveModal, Button } from '@/shared/ui';
import { Loader2 } from 'lucide-react';
import styles from './DeviceModal.module.css';

interface DeviceDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeviceDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeviceDeleteModalProps) {
  const { t } = useTranslation();

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('devices.confirm_delete_title', 'Delete device')}
    >
      <div className={styles.modalContent}>
        <p>{t('devices.confirm_delete')}</p>
        <div className={styles.modalActions}>
          <Button variant="accentSoft" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isPending}>
            {isPending ? <Loader2 className={styles.spinner} size={18} /> : t('common.delete')}
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
