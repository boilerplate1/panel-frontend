import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MonitorSmartphone, History } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import styles from './FloatingNavbar.module.css';

interface FloatingNavbarProps {
  hideSidebar?: boolean;
}

export function FloatingNavbar({ hideSidebar }: FloatingNavbarProps) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.dockContainer} ${hideSidebar ? styles.hideOnMobile : ''}`}>
      <nav className={styles.dock}>
        <NavLink
          to={ROUTES.DASHBOARD}
          end
          className={({ isActive }) => `${styles.dockItem} ${isActive ? styles.dockItemActive : ''}`}
        >
          <div className={styles.iconWrapper}>
            <User size={18} className={styles.icon} />
          </div>
          <span className={styles.label}>{t('dashboard.sidebar_profile')}</span>
        </NavLink>

        <NavLink
          to={ROUTES.DEVICES}
          className={({ isActive }) => `${styles.dockItem} ${isActive ? styles.dockItemActive : ''}`}
        >
          <div className={styles.iconWrapper}>
            <MonitorSmartphone size={18} className={styles.icon} />
          </div>
          <span className={styles.label}>{t('dashboard.sidebar_devices')}</span>
        </NavLink>

        <NavLink
          to={ROUTES.HISTORY}
          className={({ isActive }) => `${styles.dockItem} ${isActive ? styles.dockItemActive : ''}`}
        >
          <div className={styles.iconWrapper}>
            <History size={18} className={styles.icon} />
          </div>
          <span className={styles.label}>{t('dashboard.sidebar_history')}</span>
        </NavLink>
      </nav>
    </div>
  );
}
