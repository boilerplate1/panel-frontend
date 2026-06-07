import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/shared/lib';
import { Toast, Seo, PwaInstallBanner } from '@/shared/ui';
import styles from './GlobalLayout.module.css';

export function GlobalLayout() {
  const { toast, hideToast } = useUIStore();
  const location = useLocation();
  const { t } = useTranslation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const brand = 'Hypex';
    const msg = t('shared.console_warning', { brand });

    console.clear();
    console.log(
      `%c ${brand} %c\n\n${msg}`,
      'background: #FF8A3D; color: #000; font-size: 11px; font-weight: 900; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em;',
      'color: inherit; font-size: 11px; font-family: monospace;',
    );
  }, [t]);

  useEffect(() => {
    // Background is now handled by global CSS to prevent flashing
  }, [isLanding]);

  return (
    <div className={styles.root}>
      <Seo />
      <Outlet />
      <PwaInstallBanner />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
