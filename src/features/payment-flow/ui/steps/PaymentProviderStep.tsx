import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PAYMENT_METHOD_ICONS } from '@/constants';
import { YookassaIcon } from '@/shared/assets/icons';
import { Card, SectionHeader, Skeleton } from '@/shared/ui';
import styles from './PaymentProviderStep.module.css';

interface PaymentProviderStepProps {
  providers: string[];
  isLoading: boolean;
  onBack: () => void;
  onSelectProvider: (provider: string) => void;
}

export function PaymentProviderStep({
  providers,
  isLoading,
  onBack,
  onSelectProvider,
}: PaymentProviderStepProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onBack}>
            <ArrowLeft size={16} />
            <span>{t('dashboard.buy_subscription_return_to_plans')}</span>
          </button>
          <SectionHeader
            title={t('dashboard.buy_subscription_method_title')}
            subtitle={t('dashboard.buy_subscription_method_hint')}
          />
        </div>

        <div className={styles.providerList}>
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} height={74} borderRadius={12} />
              ))
            : providers.map((provider) => {
                const providerKey = provider.toLowerCase();
                const isYookassa = providerKey === 'yookassa';
                const isCrypto = providerKey.includes('crypto');
                const Icon = PAYMENT_METHOD_ICONS[providerKey] ?? PAYMENT_METHOD_ICONS.default;

                const label = isYookassa
                  ? t('dashboard.buy_subscription_method_yookassa')
                  : isCrypto
                    ? t('dashboard.buy_subscription_method_cryptopay')
                    : provider;

                const desc = isYookassa
                  ? t('dashboard.buy_subscription_method_yookassa_desc')
                  : isCrypto
                    ? t('dashboard.buy_subscription_method_cryptopay_desc')
                    : '';

                return (
                  <button
                    key={provider}
                    className={styles.providerBtn}
                    onClick={() => onSelectProvider(provider)}
                  >
                    <div className={styles.providerContent}>
                      <div className={styles.providerIcon}>
                        {isYookassa ? (
                          <img src={YookassaIcon} alt="" className={styles.providerImage} />
                        ) : (
                          <Icon size={24} />
                        )}
                      </div>
                      <div className={styles.providerText}>
                        <span className={styles.providerLabel}>{label}</span>
                        {desc && <span className={styles.providerDesc}>{desc}</span>}
                      </div>
                    </div>
                    <ChevronRight size={20} className={styles.providerChevron} />
                  </button>
                );
              })}
        </div>
      </Card>
    </div>
  );
}
