import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MirIcon, SbpIcon, YookassaIcon } from '@/shared/assets/icons';
import { Button, Card, SectionHeader, Skeleton } from '@/shared/ui';
import styles from './PaymentMethodStep.module.css';

interface PaymentMethodStepProps {
  methods: string[];
  isLoading: boolean;
  onBack: () => void;
  onSelectMethod: (method: string) => void;
}

function getMethodIcon(method: string) {
  const normalized = method.toLowerCase();
  if (normalized === 'bank_card') return MirIcon;
  if (normalized === 'sbp') return SbpIcon;
  return YookassaIcon;
}

function getMethodLabel(method: string, t: (key: string) => string) {
  const normalized = method.toLowerCase();
  if (normalized === 'bank_card') return t('dashboard.buy_subscription_method_bank_card');
  if (normalized === 'sbp') return t('dashboard.buy_subscription_method_sbp');
  if (normalized === 'yoo_money') return t('dashboard.buy_subscription_method_yoomoney');
  return method;
}

function getMethodDescription(method: string, t: (key: string) => string) {
  const normalized = method.toLowerCase();
  if (normalized === 'bank_card') return t('dashboard.buy_subscription_method_bank_card_desc');
  if (normalized === 'sbp') return t('dashboard.buy_subscription_method_sbp_desc');
  if (normalized === 'yoo_money') return t('dashboard.buy_subscription_method_yoomoney_desc');
  return '';
}

export function PaymentMethodStep({
  methods,
  isLoading,
  onBack,
  onSelectMethod,
}: PaymentMethodStepProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <div className={styles.header}>
          <Button type="button" variant="accentSoft" size="small" className={styles.backBtn} onClick={onBack}>
            <ArrowLeft size={16} />
            <span>{t('dashboard.buy_subscription_return_to_payment_methods')}</span>
          </Button>
          <SectionHeader
            title={t('dashboard.buy_subscription_method_title')}
            subtitle={t('dashboard.buy_subscription_method_hint')}
          />
        </div>

        <div className={styles.providerList}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={74} borderRadius={12} />
            ))
          ) : methods.length > 0 ? (
            methods.map((method) => {
              const icon = getMethodIcon(method);
              const desc = getMethodDescription(method, t);

              return (
                <button
                  key={method}
                  className={styles.providerBtn}
                  onClick={() => onSelectMethod(method)}
                >
                  <div className={styles.providerContent}>
                    <div className={styles.providerIcon}>
                      <img src={icon} alt="" className={styles.providerImage} />
                    </div>
                    <div className={styles.providerText}>
                      <span className={styles.providerLabel}>{getMethodLabel(method, t)}</span>
                      {desc ? <span className={styles.providerDesc}>{desc}</span> : null}
                    </div>
                  </div>
                  <ChevronRight size={20} className={styles.providerChevron} />
                </button>
              );
            })
          ) : (
            <div className={styles.emptyText}>
              {t('dashboard.buy_subscription_provider_unavailable')}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
