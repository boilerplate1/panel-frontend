import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, History, Loader2, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useSubscriptionsQuery } from '@/entities/subscription';
import { copyToClipboard, formatTraffic, formatDate, useUIStore } from '@/shared/lib';
import { Button, Card, MetricRow } from '@/shared/ui';
import styles from './Dashboard.module.css';

const cn = (...classes: (string | undefined | boolean | null)[]) =>
  classes.filter(Boolean).join(' ');

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useUIStore();
  const { data: subscriptions, isLoading } = useSubscriptionsQuery(!!user);
  const [showKey, setShowKey] = useState(false);

  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;

  if (!user) return null;

  const accountKey = user.account_key || '-';
  const subscriptionLink = activeSubscription?.remnaSubLink ?? null;

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast(t('profile.copied'), 'success');
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('dashboard.title')}</h1>
        <p className={styles.subtitle}>{t('hero.subtitle')}</p>
      </header>

      <div className={styles.grid}>
        <Card className={styles.card}>
          <p className={styles.cardTitle}>{t('dashboard.profile')}</p>
          <p className={styles.cardValue}>{user.username}</p>
          <p className={cn(styles.cardTitle, styles.cardTitleSpaced)}>
            {user.email || t('dashboard.email_not_set')}
          </p>
        </Card>

        <Card className={styles.card}>
          <p className={styles.cardTitle}>{t('dashboard.access_key')}</p>
          <p className={styles.cardDescription}>{t('dashboard.access_key_description')}</p>
          <div className={styles.keyWrapper}>
            <p
              className={cn(
                styles.cardValue,
                styles.cardValueKey,
                showKey ? styles.cardValueVisible : styles.cardValueBlurred,
              )}
              onClick={() => setShowKey(!showKey)}
            >
              {accountKey}
            </p>
            <div className={styles.keyActions}>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowKey(!showKey)}
                className={styles.eyeBtn}
              >
                {showKey ? <EyeOff size={22} /> : <Eye size={22} />}
              </Button>
              <Button
                className={styles.copyBtnSmall}
                onClick={() => handleCopy(accountKey)}
                type="button"
                variant="secondary"
                size="small"
              >
                {t('dashboard.copy_key')}
              </Button>
            </div>
          </div>
        </Card>

        <Card className={styles.card}>
          <p className={styles.cardTitle}>{t('dashboard.buy_subscription_key_title')}</p>
          <p className={styles.cardDescription}>
            {t('dashboard.buy_subscription_key_description')}
          </p>
          {subscriptionLink ? (
            <>
              <div className={styles.keyWrapper}>
              <p
                  className={cn(styles.cardValue, styles.cardValueLink)}
                  onClick={() => handleCopy(subscriptionLink)}
                >
                  {subscriptionLink}
                </p>
                <div className={styles.keyActions}>
                  <Button
                    className={styles.copyBtnSmall}
                    onClick={() => handleCopy(subscriptionLink)}
                    type="button"
                    variant="secondary"
                    size="small"
                  >
                    {t('dashboard.buy_subscription_key_copy')}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyText}>{t('dashboard.no_subscriptions')}</div>
          )}
        </Card>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('dashboard.subscriptions')}</h2>
          <div className={styles.sectionActions}>
            <Button
              onClick={() => navigate('/dashboard/balance/history')}
              size="small"
              variant="secondary"
              className={styles.addBtn}
            >
              <History size={22} />
              {t('dashboard.purchase_history')}
            </Button>
            <Button
              onClick={() => navigate('/dashboard/subscription/buy')}
              size="small"
              className={styles.addBtn}
            >
              {activeSubscription ? <RefreshCw size={22} /> : <Plus size={22} />}
              {activeSubscription
                ? t('dashboard.buy_subscription_renew')
                : t('dashboard.purchase_subscription')}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} />
          </div>
        ) : subscriptions && subscriptions.length > 0 ? (
          <div className={styles.subscriptionsList}>
            {subscriptions.map((sub) => (
              <Card key={sub.id} className={styles.subCard}>
                  <div className={styles.subCardMain}>
                    <div className={styles.subInfo}>
                    <MetricRow
                      label={t('dashboard.traffic')}
                      value={formatTraffic(sub.trafficUsed, sub.trafficTotal, t('shared.unlimited'))}
                      tone="bare"
                    />
                    <MetricRow
                      label={t('dashboard.expires')}
                      value={formatDate(sub.expiresAt)}
                      tone="bare"
                    />
                    {sub.deviceAvailability && (
                      <div className={styles.subMain}>
                        <p className={styles.subLabel}>{t('dashboard.buy_subscription_summary_devices')}</p>
                        <div className={styles.progressBar}>
                          <div
                            className={cn(
                              styles.progressFill,
                              sub.deviceAvailability.isFull && styles.progressFillFull,
                            )}
                            style={{ width: `${(sub.deviceAvailability.used / sub.deviceAvailability.limit) * 100}%` }}
                          />
                        </div>
                        <p className={cn(styles.subValue, styles.subValueSmall)}>
                          {sub.deviceAvailability.used} / {sub.deviceAvailability.limit}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={styles.subActions}>
                    <Button
                      onClick={() => handleCopy(sub.remnaSubLink)}
                      type="button"
                      variant="secondary"
                      size="small"
                    >
                      {t('dashboard.copy_key')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>{t('dashboard.no_subscriptions')}</p>
        )}
      </div>
    </div>
  );
}
