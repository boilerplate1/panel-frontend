import { Outlet } from 'react-router-dom';
import { PageContainer } from '@/shared/ui';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  return (
    <div className={styles.authLayout}>
      <div className={styles.container}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
