import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Toast.module.css';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type = 'success', isVisible, onClose }: ToastProps) {
  const { t } = useTranslation();

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;

  if (!isVisible) return null;

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.root} ${styles[type]}`}>
        <div className={styles.iconWrapper}>
          <Icon size={22} />
        </div>
        <span className={styles.message}>{message}</span>
        <button
          className={styles.close}
          onClick={onClose}
          type="button"
          aria-label={t('shared.close_notification')}
        >
          <X size={22} />
        </button>
      </div>
    </div>
  );
}
