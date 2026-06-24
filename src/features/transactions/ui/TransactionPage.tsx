import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Card, Pagination, SectionHeader } from '@/shared/ui';
import { useTransactionPage } from '../model/useTransactionPage';
import { TransactionItem } from './components/TransactionItem';
import styles from './TransactionPage.module.css';

function TransactionPage() {
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

        {transactionsPage.isLoading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} />
          </div>
        ) : transactionsPage.transactions.length > 0 ? (
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

export default TransactionPage;
