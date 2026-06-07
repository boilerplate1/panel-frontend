import { Bell, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '@/shared/config';
import styles from './DesktopHeaderTopbar.module.css';

interface DesktopHeaderTopbarProps {
  visible: boolean;
  variant: 'landing' | 'default';
  onClose: () => void;
}

export function DesktopHeaderTopbar({ visible, variant, onClose }: DesktopHeaderTopbarProps) {
  const { t } = useTranslation();

  if (!visible) return null;

  const topbarClassName = variant === 'landing' ? styles.topbarLanding : styles.topbarDefault;

  return (
    <div className={`${styles.topbar} ${topbarClassName}`}>
      <a
        href={APP_CONFIG.TG_CHANNEL}
        target="_blank"
        rel="noreferrer"
        className={styles.topbarContent}
      >
        <Bell size={22} className={styles.topbarIcon} />
        <span className={styles.topbarTextDesktop}>{t('landing.tg_topbar')}</span>
        <span className={styles.topbarTextMobile}>
          <span>{t('landing.tg_topbar_mobile_title')}</span>
          <span>{t('landing.tg_topbar_mobile_subtitle')}</span>
        </span>
      </a>
      <button
        type="button"
        className={styles.topbarClose}
        onClick={onClose}
        aria-label={t('shared.close')}
      >
        <X size={22} />
      </button>
    </div>
  );
}
