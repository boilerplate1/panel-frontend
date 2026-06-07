import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import styles from './SummerTemplate.module.css';

export const SummerTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <div className={styles.sun} />

        <div className={styles.content}>
          <div className={styles.label}>{t('gift.intro_label')}</div>
          <h1 className={styles.title}>{t('gift.summer_title')}</h1>
          <p className={styles.subtitle}>{t('gift.summer_subtitle')}</p>

          <div className={styles.reward}>
            <div className={styles.days}>{t('gift.summer_claim_days_14')}</div>
            <div className={styles.bonus}>{t('gift.summer_bonus')}</div>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" className={styles.btn}>
              {t('gift.claim_button')}
            </Button>
            <Button variant="outline" className={styles.btn} onClick={() => navigate('/')}>
              {t('gift.back_to_home')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
