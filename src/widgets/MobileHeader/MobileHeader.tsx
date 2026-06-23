import { useLocation, useNavigate, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, ChevronLeft } from 'lucide-react';
import { Logo, ThemeToggle } from '@/shared/ui';
import { useUIStore } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import styles from './MobileHeader.module.css';

export function MobileHeader() {
  const { t } = useTranslation();
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
      <div className={styles.inner}>
        <div className={styles.leftSlot}>
          {isRoot ? (
            <Logo className={styles.logo} />
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
          <div className={styles.themeDesktop}>
            <ThemeToggle />
          </div>
          <button
            className={styles.menuButton}
            onClick={() => toggleSidebar(true)}
            aria-label="Menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>
    </header>
  );
}
