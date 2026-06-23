import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './CreatingPaymentState.module.css';

export function CreatingPaymentState() {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.creatingState} role="status" aria-live="polite">
        <Loader2 size={34} className={styles.spinner} />
        <span>{t('dashboard.buy_subscription_creating_payment')}</span>
      </div>
    </div>
  );
}
