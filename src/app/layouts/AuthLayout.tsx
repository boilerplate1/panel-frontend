import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/shared/ui';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <div className={styles.authLayout}>
      <button
        type="button"
        className={styles.backButton}
        onClick={handleBack}
        aria-label={t('shared.back')}
      >
        <ArrowLeft size={22} />
      </button>
      <div className={styles.container}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
