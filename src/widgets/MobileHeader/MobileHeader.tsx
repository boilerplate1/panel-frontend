import { useLocation, useNavigate, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, ChevronLeft, LogOut, Sun, Moon } from 'lucide-react';
import { Logo, Container, Dropdown } from '@/shared/ui';
import { useAuth } from '@/features/auth';
import { useUIStore, getCurrentTheme, applyTheme } from '@/shared/lib';
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
  const isPayPage = location.pathname === ROUTES.PAY;

  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as { title?: string; description?: string } | undefined;
  const titleKey = handle?.title;
  const descriptionKey = handle?.description;
  const pageTitle = titleKey ? t(titleKey) : '';
  const pageDescription = descriptionKey ? t(descriptionKey) : '';

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
              className={`${styles.backButton} ${isPayPage ? styles.backDesktop : ''}`}
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={28} />
            </button>
          )}
        </div>

        <div className={styles.centerSlot}>
          {!isRoot && (
            <div className={`${styles.titleBlock} ${isPayPage ? styles.backDesktop : ''}`}>
              <span className={styles.pageTitle}>{pageTitle}</span>
              {pageDescription && <span className={styles.pageDescription}>{pageDescription}</span>}
            </div>
          )}
        </div>

        <div className={styles.rightSlot}>
          <div className={styles.userDesktop}>
            <Dropdown
              trigger={
                <div className={styles.userCard}>
                  <div className={styles.userAvatar}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className={styles.userName}>{user?.username || ''}</span>
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
          <button
            className={styles.menuButton}
            onClick={() => toggleSidebar(true)}
            aria-label="Menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </Container>
    </header>
  );
}
