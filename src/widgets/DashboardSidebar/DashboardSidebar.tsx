import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, MonitorSmartphone, History, X, LogOut } from 'lucide-react';
import { useAuth } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/shared/config';
import { ThemeToggle, Card, Button } from '@/shared/ui';
import styles from './DashboardSidebar.module.css';

export function DashboardSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

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
          <Button
            type="button"
            variant="ghost"
            size="small"
            className={styles.closeButton}
            onClick={() => toggleSidebar(false)}
            aria-label={t('shared.close')}
          >
            <X size={40} />
          </Button>
        </div>

        <div className={styles.desktopOnly}>
          <Card padding="small" className={styles.navCard}>
            <nav className={styles.nav}>
              <NavLink
                to={ROUTES.DASHBOARD}
                end
                className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
              >
                <User size={20} />
                <span>{t('dashboard.sidebar_profile')}</span>
              </NavLink>

              <NavLink
                to={ROUTES.DEVICES}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
              >
                <MonitorSmartphone size={20} />
                <span>{t('dashboard.sidebar_devices')}</span>
              </NavLink>

              <NavLink
                to={ROUTES.HISTORY}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
              >
                <History size={20} />
                <span>{t('dashboard.sidebar_history')}</span>
              </NavLink>
            </nav>
          </Card>
        </div>

        <div className={styles.mobileOnly}>
          <nav className={styles.nav}>
            <NavLink
              to={ROUTES.DASHBOARD}
              end
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
        </div>

        <div className={styles.mobileBottom}>

          <div className={styles.themeRow}>
            <ThemeToggle label={t('shared.theme_toggle')} />
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              logout();
              toggleSidebar(false);
            }}
            className={styles.logoutBtn}
          >
            <LogOut size={22} />
            <span>{t('dashboard.sidebar_logout')}</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
