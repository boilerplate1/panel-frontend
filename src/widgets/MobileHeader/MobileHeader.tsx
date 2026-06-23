import { useLocation, useNavigate, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { Logo, ThemeToggle } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import styles from './MobileHeader.module.css';

export function MobileHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const matches = useMatches();

  const isRoot = location.pathname === ROUTES.DASHBOARD;
  const isPayPage = location.pathname === ROUTES.PAY;

  const currentMatch = matches[matches.length - 1];
  const titleKey = (currentMatch?.handle as { title?: string })?.title;
  const pageTitle = titleKey ? t(titleKey) : '';

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
            <span className={`${styles.pageTitle} ${isPayPage ? styles.backDesktop : ''}`}>
              {pageTitle}
            </span>
          )}
        </div>

        <div className={styles.rightSlot}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
