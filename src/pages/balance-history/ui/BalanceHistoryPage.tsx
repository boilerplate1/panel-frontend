import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { usePaymentHistoryPageQuery } from '@/features/payment-management';
import { Card, Pagination, SectionHeader } from '@/shared/ui';

import { PaymentHistoryItem } from './PaymentHistoryItem';
import { PaymentDetailModal } from './PaymentDetailModal';
import styles from './BalanceHistoryPage.module.css';

function BalanceHistoryPage() {
  const { user } = useAuth();
  const { i18n, t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaymentHistoryPageQuery(!!user, page);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  if (!user) return null;

  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';
  const history = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const selectedItem = history.find((item) => item.id === selectedItemId) ?? null;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedItemId(null);
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
        ) : history.length > 0 ? (
          <div className={styles.container}>
            {history.map((item) => (
              <PaymentHistoryItem
                key={item.id}
                item={item}
                locale={locale}
                onOpenDetail={(id) => setSelectedItemId(id)}
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

      <PaymentDetailModal
        isOpen={!!selectedItemId}
        onClose={() => setSelectedItemId(null)}
        selectedItem={selectedItem}
        locale={locale}
      />
    </div>
  );
}

export default BalanceHistoryPage;