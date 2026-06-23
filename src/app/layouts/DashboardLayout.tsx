import { useMatches, Outlet } from 'react-router-dom';
import { DashboardSidebar } from '@/widgets/DashboardSidebar';
import { MobileHeader } from '@/widgets/MobileHeader';
import { BottomNav } from '@/widgets/BottomNav';
import { PageContainer } from '@/shared/ui';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const matches = useMatches();
  const hideSidebar = matches.some(
    (match) => (match.handle as { hideSidebar?: boolean })?.hideSidebar,
  );

  return (
    <div className={styles.root}>
      <MobileHeader />

      <div className={styles.layoutContainer}>
        <div className={hideSidebar ? styles.sidebarHideDesktop : ''}>
          <DashboardSidebar />
        </div>
        <main className={`${styles.wrapper} ${hideSidebar ? styles.fullWidth : ''}`}>
          <div className={`${styles.content} ${hideSidebar ? styles.contentFull : ''}`}>
            <PageContainer>
              <Outlet />
            </PageContainer>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
