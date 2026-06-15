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
import { Card, Button, SectionHeader, Modal } from '@/shared/ui';
import styles from './BalanceHistoryPage.module.css';

function BalanceHistoryPage() {
  const { user } = useAuth();
  const { i18n, t } = useTranslation();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaymentHistoryInfiniteQuery(!!user);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unused = { fetchNextPage, hasNextPage }; 

  const locale = i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';
  const history = data?.pages.flatMap((page) => page.items) ?? [];
  const selectedItem = history.find((item) => item.id === selectedItemId) ?? null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItemId(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!user) return null;

  const closeModal = () => setSelectedItemId(null);

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
                  onClick={() => setSelectedItemId(item.id)}
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

      <Modal
        isOpen={!!selectedItem}
        onClose={closeModal}
        title={selectedItem?.planName ?? t('dashboard.subscriptions')}
      >
        {selectedItem && (
          <div className={styles.modalGrid}>
            <div className={styles.modalRow}>
              <span>{t('dashboard.history_provider')}</span>
              <strong className={styles.modalProviderValue}>
                {getPaymentProviderIcon(selectedItem.provider) ? (
                  <img
                    src={getPaymentProviderIcon(selectedItem.provider) as string}
                    alt={getPaymentProviderLabel(selectedItem.provider)}
                    className={styles.modalProviderIcon}
                  />
                ) : null}
                <span>{getPaymentProviderLabel(selectedItem.provider)}</span>
              </strong>
            </div>
            <div className={styles.modalRow}>
              <span>{t('dashboard.history_amount')}</span>
              <strong>
                {formatCurrency(selectedItem.amountCents, selectedItem.currency, locale)}
              </strong>
            </div>
            <div className={styles.modalRow}>
              <span>{t('dashboard.history_status')}</span>
              <strong className={styles.modalStatusValue}>
                {getPaymentStatusLabel(selectedItem.status, t)}
              </strong>
            </div>
            <div className={styles.modalRow}>
              <span>{t('dashboard.history_plan_id')}</span>
              <strong>{selectedItem.planId ?? '-'}</strong>
            </div>
            <div className={styles.modalRow}>
              <span>{t('dashboard.history_payment_id')}</span>
              <strong>{selectedItem.providerPaymentId ?? '-'}</strong>
            </div>
            <div className={styles.modalRow}>
              <span>{t('dashboard.history_created')}</span>
              <strong>{formatDate(selectedItem.createdAt)}</strong>
            </div>
            <div className={`${styles.modalRow} ${styles.modalRowFullWide}`}>
              <span>{t('dashboard.history_updated')}</span>
              <strong>{formatDate(selectedItem.updatedAt)}</strong>
            </div>
            {selectedItem.lastError && (
              <div className={`${styles.modalError} ${styles.modalRowFullWide}`}>
                <span>{t('dashboard.history_error')}</span>
                <strong>{selectedItem.lastError}</strong>
              </div>
            )}
            
            {(selectedItem.providerInvoiceUrl || selectedItem.lastError) && (
              <div className={styles.modalSupportBlock}>
                {selectedItem.providerInvoiceUrl && (
                  <Button
                    as="a"
                    href={selectedItem.providerInvoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalLink}
                    variant="secondary"
                  >
                    {t('dashboard.history_open_payment')}
                  </Button>
                )}
                <div className={styles.modalSupportText}>
                  {t('dashboard.history_payment_support_hint')}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default BalanceHistoryPage;
