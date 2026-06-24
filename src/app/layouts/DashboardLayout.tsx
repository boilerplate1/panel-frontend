import { Suspense } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { DashboardSidebar } from '@/widgets/DashboardSidebar';
import { MobileHeader } from '@/widgets/MobileHeader';
import { PageContainer, Container, Loader, Card } from '@/shared/ui';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const matches = useMatches();
  const hideSidebar = matches.some(
    (match) => (match.handle as { hideSidebar?: boolean })?.hideSidebar,
  );

  return (
    <div className={styles.root}>
      <MobileHeader />

      <Container className={`${styles.layoutContainer} ${hideSidebar ? styles.layoutStandalone : ''}`}>
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

        {!hideSidebar ? (
          <aside className={styles.rail}>
            <a
              className={styles.railLink}
              href="https://t.me/hypexvpn"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram-канал HypexVPN"
            >
              <Card padding="medium" className={styles.railCard}>
                <div className={styles.railTop}>
                  <div className={styles.railIcon}>
                    <MessageCircle size={18} />
                  </div>
                  <ArrowUpRight size={18} className={styles.railArrow} />
                </div>

                <div className={styles.railText}>
                  <strong>Telegram-канал HypexVPN</strong>
                  <span>Новости, обновления и важные объявления</span>
                </div>
              </Card>
            </a>
          </aside>
        ) : null}
      </Container>
    </div>
  );
}
