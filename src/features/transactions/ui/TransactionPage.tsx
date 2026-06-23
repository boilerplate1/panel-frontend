import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { usePaymentHistoryPageQuery } from '@/features/payment-management';
import { Card, Pagination, SectionHeader } from '@/shared/ui';
import { TransactionItem } from './TransactionItem';
import { TransactionDetailModal } from './modals/TransactionDetailModal';
import styles from './TransactionPage.module.css';

function TransactionPage() {
  const { user } = useAuth();
  const { i18n, t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaymentHistoryPageQuery(!!user, page);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  if (!user) return null;

  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';
  const transactions = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const selectedTransaction = transactions.find((item) => item.id === selectedTransactionId) ?? null;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedTransactionId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <SectionHeader
          title={t('dashboard.history_title')}
          subtitle={t('dashboard.history_subtitle')}
          className={styles.header}
        />

        {isLoading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} />
          </div>
        ) : transactions.length > 0 ? (
          <div className={styles.container}>
            {transactions.map((item) => (
              <TransactionItem
                key={item.id}
                transaction={item}
                locale={locale}
                onOpenDetail={(id) => setSelectedTransactionId(id)}
              />
            ))}

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </div>
        ) : (
          <div className={styles.emptyText}>{t('dashboard.history_empty')}</div>
        )}
      </Card>

      <TransactionDetailModal
        isOpen={!!selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
        transaction={selectedTransaction}
        locale={locale}
      />
    </div>
  );
}

export default TransactionPage;
