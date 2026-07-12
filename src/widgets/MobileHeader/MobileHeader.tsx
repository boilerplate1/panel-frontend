import { useLocation, useNavigate, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, LogOut, Sun, Moon } from 'lucide-react';
import { Logo, Container, Dropdown, Button } from '@/shared/ui';
import { getCurrentTheme, applyTheme } from '@/shared/lib';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/config';
import styles from './MobileHeader.module.css';

export function MobileHeader() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const matches = useMatches();

  const isRoot = location.pathname === ROUTES.DASHBOARD;

  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as
    | { title?: string; description?: string }
    | undefined;
  const titleKey = handle?.title;
  const pageTitle = titleKey ? t(titleKey, { defaultValue: titleKey }) : '';

  const goToDashboard = () => navigate(ROUTES.DASHBOARD);

  return (
    <header className={styles.wrapper}>
      <Container className={styles.inner}>
        <div className={styles.leftSlot}>
          {!isRoot && (
            <Button
              type="button"
              variant="ghost"
              size="small"
              className={styles.backButton}
              onClick={() => navigate(-1)}
              aria-label={t('shared.back')}
            >
              <ChevronLeft size={24} />
            </Button>
          )}
          <h1 className={`${styles.logoButton} ${!isRoot ? styles.logoHideOnMobile : ''}`} onClick={goToDashboard}>
            <Logo className={styles.logo} />
          </h1>
        </div>

        <div className={styles.centerSlot}>
          {!isRoot && (
            <div className={styles.titleBlock}>
              <span className={styles.pageTitle}>{pageTitle}</span>
            </div>
          )}
        </div>

        <div className={styles.rightSlot}>
          <Dropdown
            trigger={
              <div className={styles.userCard}>
                <div className={styles.userAvatar}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user?.username || 'User'}</span>
                  {user?.email && <span className={styles.userEmail}>{user.email}</span>}
                </div>
              </div>
            }
            showChevron={false}
            items={[
              {
                label: getCurrentTheme() === 'dark' ? t('shared.dark') : t('shared.light'),
                icon: getCurrentTheme() === 'dark' ? <Moon size={18} /> : <Sun size={18} />,
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
      </Container>
    </header>
  );
}
