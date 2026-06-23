import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { PageContainer, Loader } from '@/shared/ui';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  return (
    <div className={styles.authLayout}>
      <div className={styles.container}>
        <PageContainer>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </PageContainer>
      </div>
    </div>
  );
}
