import { Suspense } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { DashboardSidebar } from '@/widgets/DashboardSidebar';
import { MobileHeader } from '@/widgets/MobileHeader';
import { PageContainer, Container, Loader } from '@/shared/ui';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const matches = useMatches();
  const hideSidebar = matches.some(
    (match) => (match.handle as { hideSidebar?: boolean })?.hideSidebar,
  );

  return (
    <div className={styles.root}>
      <MobileHeader />

      <Container
        className={`${styles.layoutContainer} ${hideSidebar ? styles.layoutStandalone : ''}`}
      >
        {!hideSidebar ? <DashboardSidebar /> : null}

        <main className={`${styles.wrapper} ${hideSidebar ? styles.fullWidth : ''}`}>
          <div
            className={`${styles.content} ${hideSidebar ? styles.contentFull : ''} ${hideSidebar ? styles.contentStandalone : ''}`}
          >
            <PageContainer>
              <Suspense fallback={<Loader />}>
                <Outlet />
              </Suspense>
            </PageContainer>
          </div>
        </main>
      </Container>
    </div>
  );
}
