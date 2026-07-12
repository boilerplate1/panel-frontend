import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { Button, Card, Pagination, SectionHeader } from '@/shared/ui';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useTransactionPage } from '../model/useTransactionPage';
import { TransactionItem } from './components/TransactionItem';
import styles from './TransactionPage.module.css';

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
    console.error('TransactionsErrorBoundary caught an error', error, errorInfo);
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

function TransactionPageSkeleton() {
  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton width="40%" height={24} />
          <Skeleton width="100%" height={60} />
          <Skeleton width="100%" height={60} />
          <Skeleton width="100%" height={60} />
        </div>
      </Card>
    </div>
  );
}

function TransactionPageContent() {
  const { t } = useTranslation();
  const transactionsPage = useTransactionPage();

  if (!transactionsPage.user) return null;

  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <SectionHeader
          title={t('dashboard.history_title')}
          subtitle={t('dashboard.history_subtitle')}
          className={styles.header}
        />

        {transactionsPage.transactions.length > 0 ? (
          <div className={styles.container}>
            {transactionsPage.transactions.map((item) => (
              <TransactionItem
                key={item.id}
                transaction={item}
                locale={transactionsPage.locale}
                onOpenDetail={transactionsPage.openDetail}
              />
            ))}

            <Pagination
              page={transactionsPage.page}
              totalPages={transactionsPage.totalPages}
              onChange={transactionsPage.changePage}
            />
          </div>
        ) : (
          <div className={styles.emptyText}>{t('dashboard.history_empty')}</div>
        )}
      </Card>
    </div>
  );
}

function TransactionPage() {
  const { t } = useTranslation();
  return (
    <ErrorBoundary
      fallback={(reset) => (
        <div className={styles.wrapper}>
          <Card padding="medium" className={styles.card}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0' }}>
              <p>{t('shared.server_error')}</p>
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
      <Suspense fallback={<TransactionPageSkeleton />}>
        <TransactionPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}

export default TransactionPage;
