import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import { usePaymentHistoryInfiniteQuery } from '@/features/payment-management';
import {
  formatCurrency,
  formatDate,
  getPaymentAmountClass,
  getPaymentAmountPrefix,
  getPaymentProviderIcon,
  getPaymentProviderLabel,
  getPaymentStatusLabel,
} from '@/shared/lib';
import { Card, SectionHeader } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import styles from './BalanceHistoryPage.module.css';

function BalanceHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaymentHistoryInfiniteQuery(!!user);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';
  const history = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const target = bottomRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!user) return null;

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
            {history.map((item) => {
              const providerIcon = getPaymentProviderIcon(item.provider);
              const providerLabel = getPaymentProviderLabel(item.provider);
              const statusLabel = getPaymentStatusLabel(item.status, t);
              const amountClass = getPaymentAmountClass(item.status, styles);
              const amountPrefix = getPaymentAmountPrefix(item.status);

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.item} stagger-item`}
                  onClick={() => navigate(`${ROUTES.HISTORY}/${item.id}`)}
                >
                  <div className={styles.itemMain}>
                    <div className={styles.itemTop}>
                      <div className={styles.itemLeft}>
                        <div className={styles.itemName}>
                          {item.planName ?? t('dashboard.subscriptions')}
                        </div>
                        <div className={styles.itemStatusText}>
                          <span>{statusLabel}</span>
                        </div>
                      </div>
                      <div className={`${styles.itemAmount} ${amountClass}`}>
                        <span className={styles.itemAmountPrefix}>{amountPrefix}</span>
                        <span>{formatCurrency(item.amountCents, item.currency, locale)}</span>
                      </div>
                    </div>

                    <div className={styles.itemMeta}>
                      <span className={styles.providerAmountRow}>
                        <span className={styles.providerIconRow}>
                          {providerIcon ? (
                            <img
                              src={providerIcon as string}
                              alt={providerLabel}
                              className={styles.providerIcon}
                            />
                          ) : null}
                          <span>{providerLabel}</span>
                        </span>
                        <span className={`${styles.mobileAmount} ${amountClass}`}>
                          <span className={styles.itemAmountPrefix}>{amountPrefix}</span>
                          <span>{formatCurrency(item.amountCents, item.currency, locale)}</span>
                        </span>
                      </span>
                      <span>
                        {t('dashboard.history_date')}: {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            <div ref={bottomRef} className={styles.loaderTarget}>
              {isFetchingNextPage && <Loader2 className={styles.spinner} />}
            </div>
          </div>
        ) : (
          <div className={styles.emptyText}>{t('dashboard.history_empty')}</div>
        )}
      </Card>
    </div>
  );
}

export default BalanceHistoryPage;
