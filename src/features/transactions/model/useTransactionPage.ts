import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentHistoryPageSuspenseQuery } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/features/auth';

export function useTransactionPage() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data } = usePaymentHistoryPageSuspenseQuery(page);

  const transactions = data?.items ?? [];

  const changePage = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openDetail = useCallback((transactionId: string) => {
    navigate(`${ROUTES.HISTORY}/${transactionId}?page=${page}`);
  }, [navigate, page]);

  return {
    user,
    page,
    transactions,
    totalPages: data?.totalPages ?? 0,
    locale: i18n.language.startsWith('ru') ? ('ru-RU' as const) : ('en-US' as const),
    openDetail,
    changePage,
  };
}
