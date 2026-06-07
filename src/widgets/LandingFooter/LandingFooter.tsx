import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '@/shared/config';
import styles from './LandingFooter.module.css';

export function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3 className={styles.brandName}>{t('shared.brand_name')}</h3>
            <p className={styles.tagline}>{t('footer.tagline')}</p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>{t('footer.product')}</h4>
            <Link to="/download" className={styles.link}>
              {t('navbar.download')}
            </Link>
            <Link to="/wiki" className={styles.link}>
              {t('footer.wiki')}
            </Link>
            <a href="/#pricing" className={styles.link}>
              {t('landing.view_plans')}
            </a>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>{t('footer.support')}</h4>
            <a href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`} className={styles.link}>
              {APP_CONFIG.SUPPORT_EMAIL}
            </a>
            <a href={APP_CONFIG.TG_CHANNEL} target="_blank" rel="noreferrer" className={styles.link}>
              {t('footer.telegram_channel')}
            </a>
            <a href="https://t.me/hypex_support" target="_blank" rel="noreferrer" className={styles.link}>
              {t('footer.technical_support')}
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} {t('shared.brand_name')}. {t('footer.all_rights_reserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
