import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useBackendHealthQuery } from '@/shared/api';
import { Loader, Button } from '@/shared/ui';
import styles from './BackendAvailabilityGate.module.css';

interface BackendAvailabilityGateProps {
  children: ReactNode;
}

export function BackendAvailabilityGate({ children }: BackendAvailabilityGateProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, isFetching, refetch } = useBackendHealthQuery();

  const errorMessage = t('shared.server_error');

  if (isError) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t('backend.unavailable')}</h1>
          <p className={styles.meta}>{errorMessage}</p>

          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? t('backend.checking') : t('backend.retry')}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <Loader fullPage />;
  }

  return <>{children}</>;
}
