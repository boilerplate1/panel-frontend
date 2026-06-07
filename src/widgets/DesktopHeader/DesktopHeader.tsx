import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Menu } from 'lucide-react';
import styles from './DesktopHeader.module.css';
import { Logo, Button } from '@/shared/ui';
import { useAuth } from '@/features/auth';
import { UserDropdown } from './UserDropdown';
import { DesktopHeaderTopbar } from './DesktopHeaderTopbar';
import { DesktopHeaderDrawer } from './DesktopHeaderDrawer';
import { useDesktopHeaderState } from './useDesktopHeaderState';
import { useNavigationConfig } from './useNavigationConfig';

interface DesktopHeaderProps {
  isLoggedIn: boolean;
}

const cn = (...classes: (string | undefined | boolean | null)[]) =>
  classes.filter(Boolean).join(' ');

export function DesktopHeader({ isLoggedIn }: DesktopHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTopbar, setShowTopbar] = useState(() => localStorage.getItem('hide_tg_topbar') !== 'true');
  
  const {
    location,
    isDashboard,
    isLanding,
    canGoBack,
    pageTitle,
    drawerTitle,
    activeSubscription,
  } = useDesktopHeaderState({ isLoggedIn });

  const { mainNavItems, dashboardNavItems } = useNavigationConfig(isLoggedIn, !!activeSubscription);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  const closeTopbar = () => {
    setShowTopbar(false);
    localStorage.setItem('hide_tg_topbar', 'true');
  };

  const navItems = isDashboard ? dashboardNavItems : mainNavItems;

  const renderTopbar = showTopbar && !isDashboard;

  return (
    <>
      <DesktopHeaderTopbar
        visible={renderTopbar}
        variant={isLanding ? 'landing' : 'default'}
        onClose={closeTopbar}
      />

      <nav
        className={cn(
          styles.wrapper,
          isLanding && styles.wrapperLanding,
          renderTopbar && styles.hasTopbar,
          'pwa-header-fix'
        )}
      >
        <div className={cn(styles.content, 'container')}>
          <div className={styles.left}>
            {canGoBack && (
              <button
                type="button"
                className={cn(styles.backButton, styles.backVisible)}
                onClick={handleBack}
                aria-label={t('shared.back')}
              >
                <ArrowLeft size={22} />
              </button>
            )}
            <div
              className={cn(styles.logo, !canGoBack && styles.logoMobileVisible)}
              onClick={() => navigate('/')}
            >
              <Logo />
            </div>
            {isLoggedIn && canGoBack && <div className={styles.pageTitle}>{pageTitle}</div>}
          </div>

          {!isDashboard && !canGoBack && (
            <div className={styles.navMenu}>
              {mainNavItems.map((item) => (
                <button
                  key={item.path}
                  className={cn(styles.navLink, location.pathname === item.path && styles.navLinkActive)}
                  onClick={() => navigate(item.path)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            {isLoggedIn ? (
              <>
                <div className={styles.desktopOnly}>
                  {location.pathname !== '/dashboard/profile' && (
                    <UserDropdown username={user?.username || ''} />
                  )}
                </div>
                <button
                  className={styles.menuBtn}
                  onClick={() => setIsMenuOpen(true)}
                  aria-label={t('shared.open_menu')}
                >
                  <Menu size={22} />
                </button>
              </>
            ) : (
              <Button variant="outline" size="small" onClick={() => navigate('/login')}>
                {t('navbar.login')}
              </Button>
            )}
          </div>
        </div>
      </nav>

      <DesktopHeaderDrawer
        open={isMenuOpen}
        title={drawerTitle}
        isLoggedIn={isLoggedIn}
        userEmail={user?.email}
        items={navItems}
        activePath={location.pathname}
        onNavigate={(path) => navigate(path)}
        onLogout={() => logout()}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
