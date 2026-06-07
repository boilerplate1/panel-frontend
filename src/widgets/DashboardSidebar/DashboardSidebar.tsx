import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MonitorSmartphone, History } from 'lucide-react';
import styles from './DashboardSidebar.module.css';

export function DashboardSidebar() {
  const { t } = useTranslation();

  return (
    <aside className={styles.wrapper}>
      <nav className={styles.nav}>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
        >
          <User size={22} />
          <span>{t('dashboard.sidebar_profile')}</span>
        </NavLink>

        <NavLink
          to="/dashboard/devices"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
        >
          <MonitorSmartphone size={22} />
          <span>{t('dashboard.sidebar_devices')}</span>
        </NavLink>

        <NavLink
          to="/dashboard/balance/history"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
        >
          <History size={22} />
          <span>{t('dashboard.sidebar_history')}</span>
        </NavLink>
      </nav>
    </aside>
  );
}
