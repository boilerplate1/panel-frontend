import { Suspense } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { MobileHeader } from '@/widgets/MobileHeader';
import { FloatingNavbar } from '@/widgets/FloatingNavbar';
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

      <Container className={`${styles.layoutContainer} ${hideSidebar ? styles.layoutCheckout : ''}`}>
        <main className={styles.wrapper}>
          <div className={styles.content}>
            <PageContainer>
              <Suspense fallback={<Loader />}>
                <Outlet />
              </Suspense>
            </PageContainer>
          </div>
        </main>
      </Container>

      <FloatingNavbar hideSidebar={hideSidebar} />
    </div>
  );
}
