import { useTranslation } from 'react-i18next';
import styles from './Logo.module.css';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  const { t } = useTranslation();
  return (
    <div className={`${styles.root} ${className}`}>
      <span className={styles.text}>{t('shared.brand_name')}</span>
    </div>
  );
}
