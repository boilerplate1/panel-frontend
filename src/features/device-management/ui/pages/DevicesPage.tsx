import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { Button, Card, Pagination, SectionHeader } from '@/shared/ui';
import { DeviceCardSkeleton } from '@/shared/ui/Skeleton';
import { useDevicesPage } from '../../model/useDevicesPage';
import { DeviceDeleteModal } from '../modals/DeviceDeleteModal';
import { DeviceRenameModal } from '../modals/DeviceRenameModal';
import { DeviceItem } from './DeviceItem';
import styles from './DevicesPage.module.css';

// Simple, reusable ErrorBoundary component
interface ErrorBoundaryProps {
  fallback: (reset: () => void) => React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('DevicesErrorBoundary caught an error', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.reset);
    }
    return this.props.children;
  }
}

function DevicesPageSkeleton() {
  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <DeviceCardSkeleton />
        <DeviceCardSkeleton />
        <DeviceCardSkeleton />
      </Card>
    </div>
  );
}

function DevicesPageContent() {
  const { t } = useTranslation();
  const devicesPage = useDevicesPage();

  if (!devicesPage.user) return null;

  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <SectionHeader
          title={t('devices.title')}
          subtitle={t('devices.subtitle')}
          className={styles.header}
        />

        <div className={styles.container}>
          {devicesPage.devices.length > 0 ? (
            devicesPage.devices.map((device) => (
              <DeviceItem
                key={device.id}
                device={device}
                dataUpdatedAt={devicesPage.dataUpdatedAt}
                onEdit={devicesPage.editDevice}
                onDelete={devicesPage.requestDelete}
              />
            ))
          ) : (
            <p className={styles.emptyText}>{t('devices.empty')}</p>
          )}
        </div>

        {devicesPage.totalPages > 1 && (
          <Pagination
            page={devicesPage.page}
            totalPages={devicesPage.totalPages}
            onChange={devicesPage.setPage}
          />
        )}
      </Card>

      <DeviceDeleteModal
        isOpen={!!devicesPage.deleteTargetId}
        onClose={devicesPage.closeDeleteModal}
        onConfirm={devicesPage.confirmDelete}
        isPending={devicesPage.isRemovingDevice}
      />

      <DeviceRenameModal
        isOpen={!!devicesPage.editingDevice}
        onClose={devicesPage.closeEditModal}
        currentName={devicesPage.editingDevice?.name ?? ''}
        isPending={devicesPage.isUpdatingDevice}
        onSave={devicesPage.saveDeviceName}
      />
    </div>
  );
}

function DevicesPage() {
  const { t } = useTranslation();
  return (
    <ErrorBoundary
      fallback={(reset) => (
        <div className={styles.wrapper}>
          <Card padding="medium" className={styles.card}>
            <div className={styles.errorState}>
              <p className={styles.errorText}>{t('shared.server_error')}</p>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => {
                  window.location.reload();
                  reset();
                }}
              >
                <RefreshCw size={18} />
                {t('shared.retry')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    >
      <Suspense fallback={<DevicesPageSkeleton />}>
        <DevicesPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}

export default DevicesPage;
