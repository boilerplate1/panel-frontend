import { useLocation, useNavigate, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, ChevronLeft, LogOut, Sun, Moon } from 'lucide-react';
import { Logo, Container, Dropdown } from '@/shared/ui';
import { getCurrentTheme, applyTheme } from '@/shared/lib';
import { useAuth } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/shared/config';
import styles from './MobileHeader.module.css';

export function MobileHeader() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const matches = useMatches();
  const { toggleSidebar } = useUIStore();

  const isRoot = location.pathname === ROUTES.DASHBOARD;

  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as
    | { title?: string; description?: string; hideSidebar?: boolean }
    | undefined;
  const titleKey = handle?.title;
  const descriptionKey = handle?.description;
  const hideSidebar = !!handle?.hideSidebar;
  const pageTitle = titleKey ? t(titleKey, { defaultValue: titleKey }) : '';
  const pageDescription = descriptionKey ? t(descriptionKey, { defaultValue: descriptionKey }) : '';

  return (
    <header className={styles.wrapper}>
      <Container className={styles.inner}>
        <div className={styles.leftSlot}>
          <div className={styles.logoDesktop}>
            <Logo className={styles.logo} />
          </div>
          {isRoot ? (
            <Logo className={styles.logoMobile} />
          ) : (
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={28} />
            </button>
          )}
        </div>

        <div className={styles.centerSlot}>
          {!isRoot ? (
            <div className={styles.titleBlock}>
              <span className={styles.pageTitle}>{pageTitle}</span>
              {pageDescription && <span className={styles.pageDescription}>{pageDescription}</span>}
            </div>
          ) : null}
        </div>

        <div className={styles.rightSlot}>
          <div className={styles.userDesktop}>
            <Dropdown
              trigger={
                <div className={styles.userCard}>
                  <div className={styles.userAvatar}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
              }
              showChevron={false}
              items={[
                {
                  label: getCurrentTheme() === 'dark' ? t('shared.light') : t('shared.dark'),
                  icon: getCurrentTheme() === 'dark' ? <Sun size={18} /> : <Moon size={18} />,
                  onClick: () => applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark'),
                },
                {
                  label: t('dashboard.sidebar_logout'),
                  icon: <LogOut size={18} />,
                  onClick: () => logout(),
                  variant: 'danger',
                },
              ]}
            />
          </div>
          {!hideSidebar ? (
            <button
              className={styles.menuButton}
              onClick={() => toggleSidebar(true)}
              aria-label={t('shared.open_menu')}
            >
              <Menu size={24} />
            </button>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
