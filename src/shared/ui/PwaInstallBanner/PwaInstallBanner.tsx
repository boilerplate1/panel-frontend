import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X } from 'lucide-react';
import styles from './PwaInstallBanner.module.css';

export const PwaInstallBanner: React.FC = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Check if user dismissed it recently
      const isDismissed = localStorage.getItem('pwa_banner_dismissed') === 'true';
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsVisible(false);
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Download size={20} className={styles.icon} />
        </div>
        <div className={styles.textContainer}>
          <p className={styles.title}>Hypex VPN App</p>
          <p className={styles.description}>{t('pwa.install_description', 'Добавьте на главный экран для быстрого доступа')}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={handleInstall} className={styles.installBtn}>
          {t('pwa.install_btn', 'Добавить')}
        </button>
        <button onClick={handleDismiss} className={styles.closeBtn} aria-label="Close">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
