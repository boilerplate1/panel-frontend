import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, MonitorSmartphone, History, X, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useUIStore, getCurrentTheme, subscribeTheme, type Theme } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import { ThemeToggle } from '@/shared/ui';
import styles from './DashboardSidebar.module.css';

export function DashboardSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const [currentTheme, setCurrentTheme] = useState<Theme>(getCurrentTheme);

  useEffect(() => {
    return subscribeTheme(setCurrentTheme);
  }, []);

  useEffect(() => {
    toggleSidebar(false);
  }, [location.pathname, toggleSidebar]);

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth <= 992) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isSidebarOpen]);

  return (
    <>
      {isSidebarOpen && <div className={styles.overlay} onClick={() => toggleSidebar(false)} />}

      <aside className={`${styles.wrapper} ${isSidebarOpen ? styles.wrapperOpen : ''}`}>
        <div className={styles.mobileHeader}>
          <span className={styles.mobileTitle}>{t('shared.brand_name')}</span>
          <button className={styles.closeButton} onClick={() => toggleSidebar(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to={ROUTES.DASHBOARD}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            <User size={22} />
            <span>{t('dashboard.sidebar_profile')}</span>
          </NavLink>

          <NavLink
            to={ROUTES.DEVICES}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            <MonitorSmartphone size={22} />
            <span>{t('dashboard.sidebar_devices')}</span>
          </NavLink>

          <NavLink
            to={ROUTES.HISTORY}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            <History size={22} />
            <span>{t('dashboard.sidebar_history')}</span>
          </NavLink>
        </nav>

        <div className={styles.mobileBottom}>
          <div className={styles.divider} />

          <div className={styles.themeRow}>
            <ThemeToggle label={currentTheme === 'dark' ? t('shared.dark') : t('shared.light')} />
          </div>

          <button
            onClick={() => {
              logout();
              toggleSidebar(false);
            }}
            className={styles.logoutBtn}
          >
            <LogOut size={22} />
            <span>{t('dashboard.sidebar_logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
