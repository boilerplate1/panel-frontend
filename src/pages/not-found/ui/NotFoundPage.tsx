import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';

import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  const { t } = useTranslation();

  const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);
  const heading = is404 ? t('errors.error_404') : t('errors.system_error_title');
  const description = is404 ? t('errors.not_found_desc') : t('errors.system_error_desc');

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>{is404 ? heading : t('errors.oops')}</h1>
        {!is404 && <h2 className={styles.subtitle}>{heading}</h2>}
        <p className={styles.text}>{description}</p>
        <Button onClick={() => navigate('/')} variant="primary" className={styles.btn}>
          {t('shared.back_to_home')}
        </Button>
      </div>
    </div>
  );
}
