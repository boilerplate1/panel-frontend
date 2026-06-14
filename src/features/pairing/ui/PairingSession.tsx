import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/shared/ui';
import { APP_CONFIG } from '@/shared/config';
import { usePairingInitQuery, usePairingStatusQuery } from '../api/query';
import styles from './PairingSession.module.css';

export function PairingSession() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const initQuery = usePairingInitQuery(true);
  const sessionId = initQuery.data?.id ?? null;
  const shortCode = initQuery.data?.shortCode ?? null;
  const statusQuery = usePairingStatusQuery(sessionId);

  useEffect(() => {
    if (statusQuery.data?.status === 'confirmed') {
      navigate('/my/devices');
    }
  }, [navigate, statusQuery.data?.status]);

  if (initQuery.isLoading || !sessionId)
    return <div className={styles.loading}>{t('pairing.loading')}</div>;

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <h2 className={styles.title}>{t('pairing.title')}</h2>
        <div className={styles.qrWrapper}>
          <QRCodeSVG value={`${APP_CONFIG.BASE_URL}/auth/pair?sessionId=${sessionId}`} size={256} />
        </div>
        <p className={styles.text}>{t('pairing.subtitle')}</p>
        {shortCode ? (
          <p className={styles.text}>
            {t('pairing.code')}: {shortCode}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
