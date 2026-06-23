import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentHistoryPageQuery } from '@/shared/api';
import { useAuth } from '@/stores/authStore';

export function useTransactionPage() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const { data, isLoading } = usePaymentHistoryPageQuery(!!user, page);

  const transactions = data?.items ?? [];
  const selectedTransaction =
    transactions.find((item) => item.id === selectedTransactionId) ?? null;

  const changePage = (newPage: number) => {
    setPage(newPage);
    setSelectedTransactionId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    user,
    page,
    isLoading,
    transactions,
    totalPages: data?.totalPages ?? 0,
    selectedTransaction,
    isDetailOpen: !!selectedTransactionId,
    locale: i18n.language.startsWith('ru') ? ('ru-RU' as const) : ('en-US' as const),
    openDetail: setSelectedTransactionId,
    closeDetail: () => setSelectedTransactionId(null),
    changePage,
  };
}
