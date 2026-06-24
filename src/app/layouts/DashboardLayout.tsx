import { Suspense } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { DashboardSidebar } from '@/widgets/DashboardSidebar';
import { MobileHeader } from '@/widgets/MobileHeader';
import { PageContainer, Container, Loader, Card } from '@/shared/ui';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const matches = useMatches();
  const hideSidebar = matches.some(
    (match) => (match.handle as { hideSidebar?: boolean })?.hideSidebar,
  );
  const railBanners = [
    {
      id: 'telegram-channel',
      href: 'https://t.me/hypexvpn',
      label: 'Telegram-канал HypexVPN',
      title: 'Новости, обновления и важные объявления',
      meta: 'Telegram',
    },
  ];

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

        {!hideSidebar ? (
          <aside className={styles.rail}>
            {railBanners.map((banner) => (
              <a
                key={banner.id}
                className={styles.railLink}
                href={banner.href}
                target="_blank"
                rel="noreferrer"
                aria-label={banner.label}
              >
                <Card padding="medium" className={styles.railCard}>
                  <div className={styles.railText}>
                    <strong>{banner.label}</strong>
                    <span>{banner.title}</span>
                  </div>

                  <div className={styles.railMeta}>{banner.meta}</div>
                </Card>
              </a>
            ))}
          </aside>
        ) : null}
      </Container>
    </div>
  );
}
