import { Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { DesktopHeader } from '@/widgets/DesktopHeader';
import { PageContainer } from '@/shared/ui';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <DesktopHeader isLoggedIn={isAuthenticated} />
      <div className={styles.root}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </>
  );
};
