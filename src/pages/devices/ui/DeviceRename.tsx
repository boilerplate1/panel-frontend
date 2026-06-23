import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveModal, Button, FormField } from '@/shared/ui';
import { Loader2 } from 'lucide-react';
import styles from './DevicesPage.module.css';

interface RenameDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  isPending: boolean;
  onSave: (name: string) => Promise<void>;
}

export function RenameDeviceModal({ isOpen, onClose, currentName, isPending, onSave }: RenameDeviceModalProps) {
  const { t } = useTranslation();
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (isOpen) setEditName(currentName);
  }, [isOpen, currentName]);

  const handleSave = () => {
    if (editName.trim() && !isPending) onSave(editName.trim());
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={t('common.rename')}>
      <div className={styles.modalContent}>
        <FormField
          autoFocus
          label={t('devices.name_label')}
          hint={t('devices.name_example')}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          maxLength={50}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') onClose();
          }}
        />
        <div className={styles.modalActions}>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!editName.trim() || isPending}>
            {isPending ? <Loader2 className={styles.spinner} size={18} /> : t('common.save')}
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}