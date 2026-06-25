import { useState, useEffect, useCallback } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    } else if (mounted) {
      setAnimating(false);
      const timer = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, mounted]);

  const handleClose = useCallback(() => {
    setAnimating(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;

  if (!mounted) return null;

  return (
    <div className={`${styles.wrapper} ${animating ? styles.visible : styles.hidden}`}>
      <div className={`${styles.root} ${styles[type]}`}>
        <div className={styles.iconWrapper}>
          <Icon size={22} />
        </div>
        <span className={styles.message}>{message}</span>
        <button
          className={styles.close}
          onClick={handleClose}
          type="button"
          aria-label={t('shared.close_notification')}
        >
          <X size={22} />
        </button>
      </div>
    </div>
  );
}
