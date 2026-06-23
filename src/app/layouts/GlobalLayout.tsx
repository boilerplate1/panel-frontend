import { Outlet } from 'react-router-dom';
import { useAppInit } from '@/shared/hooks/useAppInit';
import { Toast, Seo } from '@/shared/ui';
import { useUIStore } from '@/stores/uiStore';
import styles from './GlobalLayout.module.css';

export function GlobalLayout() {
  const { toast, hideToast } = useUIStore();

  useAppInit();

  return (
    <div className={styles.root}>
      <Seo />
      <Outlet />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
