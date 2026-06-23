import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MonitorSmartphone, History, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useUIStore } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    toggleSidebar(false);
  };

  const items = [
    { to: ROUTES.DASHBOARD, icon: User, label: t('dashboard.sidebar_profile') },
    { to: ROUTES.DEVICES, icon: MonitorSmartphone, label: t('dashboard.sidebar_devices') },
    { to: ROUTES.HISTORY, icon: History, label: t('dashboard.sidebar_history') },
  ];

  return (
    <nav className={styles.nav}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
        >
          <item.icon size={24} />
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}

      <button className={styles.link} onClick={handleLogout}>
        <LogOut size={24} />
        <span className={styles.label}>{t('dashboard.sidebar_logout')}</span>
      </button>
    </nav>
  );
}
