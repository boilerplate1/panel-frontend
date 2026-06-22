import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import { Button, Card, ResponsiveModal, SectionHeader } from '@/shared/ui';
import styles from './BalanceHistoryPage.module.css';
import detailStyles from '../../balance-history-detail/ui/BalanceHistoryDetailPage.module.css';

function BalanceHistoryPage() {
  const { user } = useAuth();
  const { i18n, t } = useTranslation();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaymentHistoryInfiniteQuery(!!user);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';
  const history = data?.pages.flatMap((page) => page.items) ?? [];
  const selectedItem = history.find((item) => item.id === selectedItemId) ?? null;

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

  const handleOpenDetail = (id: string) => setSelectedItemId(id);
  const handleCloseDetail = () => setSelectedItemId(null);

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
                  onClick={() => handleOpenDetail(item.id)}
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

      <ResponsiveModal
        isOpen={!!selectedItem}
        onClose={handleCloseDetail}
        title={selectedItem?.planName ?? t('dashboard.subscriptions')}
      >
        {selectedItem ? (
          <div className={detailStyles.modalGrid}>
            <div className={detailStyles.modalRow}>
              <span>{t('dashboard.history_provider')}</span>
              <strong className={detailStyles.modalProviderValue}>
                {getPaymentProviderIcon(selectedItem.provider) ? (
                  <img
                    src={getPaymentProviderIcon(selectedItem.provider) as string}
                    alt={getPaymentProviderLabel(selectedItem.provider)}
                    className={detailStyles.modalProviderIcon}
                  />
                ) : null}
                <span>{getPaymentProviderLabel(selectedItem.provider)}</span>
              </strong>
            </div>
            <div className={detailStyles.modalRow}>
              <span>{t('dashboard.history_amount')}</span>
              <strong>
                {formatCurrency(selectedItem.amountCents, selectedItem.currency, locale)}
              </strong>
            </div>
            <div className={detailStyles.modalRow}>
              <span>{t('dashboard.history_status')}</span>
              <strong className={detailStyles.modalStatusValue}>
                {getPaymentStatusLabel(selectedItem.status, t)}
              </strong>
            </div>
            <div className={detailStyles.modalRow}>
              <span>{t('dashboard.history_plan_id')}</span>
              <strong>{selectedItem.planId ?? '-'}</strong>
            </div>
            <div className={detailStyles.modalRow}>
              <span>{t('dashboard.history_payment_id')}</span>
              <strong>{selectedItem.providerPaymentId ?? '-'}</strong>
            </div>
            <div className={detailStyles.modalRow}>
              <span>{t('dashboard.history_created')}</span>
              <strong>{formatDate(selectedItem.createdAt)}</strong>
            </div>
            <div className={`${detailStyles.modalRow} ${detailStyles.modalRowFullWide}`}>
              <span>{t('dashboard.history_updated')}</span>
              <strong>{formatDate(selectedItem.updatedAt)}</strong>
            </div>
            {selectedItem.lastError && (
              <div className={`${detailStyles.modalError} ${detailStyles.modalRowFullWide}`}>
                <span>{t('dashboard.history_error')}</span>
                <strong>{selectedItem.lastError}</strong>
              </div>
            )}
            {(selectedItem.providerInvoiceUrl || selectedItem.lastError) && (
              <div className={detailStyles.modalSupportBlock}>
                {selectedItem.providerInvoiceUrl && (
                  <Button
                    as="a"
                    href={selectedItem.providerInvoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={detailStyles.modalLink}
                    variant="secondary"
                  >
                    {t('dashboard.history_open_payment')}
                  </Button>
                )}
                <div className={detailStyles.modalSupportText}>
                  {t('dashboard.history_payment_support_hint')}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>{t('dashboard.history_empty')}</p>
        )}
      </ResponsiveModal>
    </div>
  );
}

export default BalanceHistoryPage;
