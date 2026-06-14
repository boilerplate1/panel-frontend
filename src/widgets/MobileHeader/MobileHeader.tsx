import { useLocation, useNavigate, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, ChevronLeft } from 'lucide-react';
import { Logo } from '@/shared/ui';
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

  const currentMatch = matches[matches.length - 1];
  const titleKey = (currentMatch?.handle as { title?: string })?.title;
  const pageTitle = titleKey ? t(titleKey) : '';

  return (
    <header className={styles.wrapper}>
      <div className={styles.leftSlot}>
        {isRoot ? (
          <Logo className={styles.logo} />
        ) : (
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ChevronLeft size={28} />
          </button>
        )}
      </div>

      <div className={styles.centerSlot}>
        {!isRoot && <span className={styles.pageTitle}>{pageTitle}</span>}
      </div>

      <div className={styles.rightSlot}>
        <button className={styles.menuButton} onClick={() => toggleSidebar(true)} aria-label="Menu">
          <Menu size={28} />
        </button>
      </div>
    </header>
  );
}
