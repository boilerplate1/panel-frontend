import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import { X } from 'lucide-react';
import { Logo } from '@/shared/ui';
import styles from './DesktopHeader.module.css';

export interface DesktopHeaderNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface DesktopHeaderDrawerProps {
  open: boolean;
  title: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
  items: DesktopHeaderNavItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

const cn = (...classes: (string | undefined | boolean | null)[]) =>
  classes.filter(Boolean).join(' ');

export function DesktopHeaderDrawer({
  open,
  title,
  isLoggedIn,
  userEmail,
  items,
  activePath,
  onNavigate,
  onLogout,
  onClose,
}: DesktopHeaderDrawerProps) {
  const { t } = useTranslation();

  return (
    <>
      <div
        className={cn(styles.drawerBackdrop, open && styles.drawerBackdropOpen)}
        onClick={onClose}
        role="presentation"
      />
      <div className={cn(styles.drawer, open && styles.drawerOpen)}>
        <div className={styles.drawerHandle} aria-hidden="true" />
          <div className={styles.drawerHeader}>
            <div className={styles.drawerTitle}>{title}</div>
          <div className={styles.drawerBrand}>
            <Logo />
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t('shared.close_menu')}
          >
            <X size={22} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          <div className={styles.drawerProfile}>
            <div className={styles.drawerUserInfo}>
              {userEmail ? <div className={styles.drawerUserEmail}>{userEmail}</div> : null}
            </div>
          </div>

          <div className={styles.menuList}>
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  className={cn(styles.menuItem, activePath === item.path && styles.menuItemActive)}
                  onClick={() => onNavigate(item.path)}
                >
                  <Icon size={22} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.drawerFooter}>
            {isLoggedIn && (
              <button className={styles.logoutBtn} onClick={onLogout}>
                {t('navbar.logout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
