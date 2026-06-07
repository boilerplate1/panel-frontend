import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { useClientSettingsQuery } from '@/shared/api';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { data: clientSettings } = useClientSettingsQuery();
  const registrationEnabled = clientSettings?.flags?.allowRegistration ?? true;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>{t('shared.brand_name').toUpperCase()}</div>
            <p className={styles.brandDescription}>{t('footer.brand_description')}</p>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>{t('footer.product')}</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="#features">{t('navbar.features')}</a>
              </li>
              <li>
                <a href="#pricing">{t('pricing.title')}</a>
              </li>
              <li>
                <Link to={registrationEnabled ? '/register' : '/login'}>
                  {registrationEnabled ? t('pricing.get_started') : t('auth.login')}
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>{t('footer.support')}</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="#">{t('footer.status')}</a>
              </li>
              <li>
                <a href="#">{t('footer.contact')}</a>
              </li>
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>{t('footer.legal')}</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="#">{t('footer.terms')}</a>
              </li>
              <li>
                <a href="#">{t('footer.privacy')}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} {t('shared.brand_name')} VPN. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
