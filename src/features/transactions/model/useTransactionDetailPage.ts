import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePaymentHistoryPageQuery } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/features/auth';

export function useTransactionDetailPage() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1') || 1;
  const { data, isLoading } = usePaymentHistoryPageQuery(!!user, page);

  const transaction = useMemo(
    () => data?.items.find((item) => item.id === transactionId) ?? null,
    [data?.items, transactionId],
  );

  const backToHistory = () => {
    navigate(`${ROUTES.HISTORY}?page=${page}`);
  };

  return {
    user,
    isLoading,
    transaction,
    locale: i18n.language.startsWith('ru') ? ('ru-RU' as const) : ('en-US' as const),
    backToHistory,
  };
}
