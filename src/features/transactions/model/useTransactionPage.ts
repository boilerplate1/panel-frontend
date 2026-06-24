import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentHistoryPageQuery } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/stores/authStore';

export function useTransactionPage() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaymentHistoryPageQuery(!!user, page);

  const transactions = data?.items ?? [];

  const changePage = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDetail = (transactionId: string) => {
    navigate(`${ROUTES.HISTORY}/${transactionId}?page=${page}`);
  };

  return {
    user,
    page,
    isLoading,
    transactions,
    totalPages: data?.totalPages ?? 0,
    locale: i18n.language.startsWith('ru') ? ('ru-RU' as const) : ('en-US' as const),
    openDetail,
    changePage,
  };
}
