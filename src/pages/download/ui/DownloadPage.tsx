import { useState } from 'react';
import { Check, Copy, Download, Eye, EyeOff } from 'lucide-react';
import { FaAndroid, FaWindows, FaApple } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '@/shared/config';
import { useAuth } from '@/features/auth';
import { Button } from '@/shared/ui';
import styles from './DownloadPage.module.css';
import { useSecureClipboard } from '@/shared/hooks/useSecureClipboard';

function DownloadPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useState(false);
  const { copy } = useSecureClipboard();

  const subscriptionLink = user?.subscriptionKey || '';
  const maskedLink = '••••••••••••••••';

  const handleCopy = async () => {
    const success = await copy(subscriptionLink, 'Subscription Key');
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const platforms = [
    {
      id: 'android',
      title: 'Android',
      description: t('download.android_desc'),
      icon: <FaAndroid />,
      available: true,
      url: APP_CONFIG.ANDROID_APK_URL,
    },
    {
      id: 'windows',
      title: 'Windows',
      description: t('download.windows_desc'),
      icon: <FaWindows />,
      available: true,
      url: APP_CONFIG.WINDOWS_EXE_URL,
    },
    {
      id: 'ios',
      title: 'iOS',
      description: t('download.ios_desc'),
      icon: <FaApple />,
      available: false,
      url: '#',
    },
  ];

  return (
    <main className={styles.page}>
      <div className="container">
        {isAuthenticated && (
          <section className={styles.configSection}>
            <div className={styles.configCopy}>
              <div className={styles.configText}>
                <h3 className={styles.configTitle}>{t('download.config_title')}</h3>
                <p className={styles.configDescription}>{t('download.config_desc')}</p>
              </div>
              <div className={styles.configKeyRow}>
                <button className={styles.configKey} onClick={() => setIsLinkVisible(!isLinkVisible)}>
                  <code>{isLinkVisible ? subscriptionLink : maskedLink}</code>
                  {isLinkVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button className={styles.copyButton} onClick={handleCopy}>
                  {isCopied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </section>
        )}

        <section className={styles.platforms}>
          {platforms.map((platform) => {
            return (
              <article key={platform.id} className={styles.platformCard}>
                <div className={styles.platformHeader}>
                  <div className={platform.available ? styles.platformIcon : styles.platformIconSoon}>
                    {platform.icon}
                  </div>
                  <div className={platform.available ? styles.statusReady : styles.statusSoon}>
                    {platform.available ? t('download.status_ready') : t('download.status_soon')}
                  </div>
                </div>

                <div>
                  <h2 className={platform.available ? styles.platformTitle : styles.platformTitleMuted}>
                    {platform.title}
                  </h2>
                  <p className={styles.platformDescription}>{platform.description}</p>
                </div>

                {platform.available ? (
                  <Button
                    as="a"
                    href={platform.url}
                    variant="primary"
                    className={styles.downloadButton}
                    download
                  >
                    <Download size={20} />
                    {t('download.download_btn')}
                  </Button>
                ) : (
                  <div className={styles.lockedAction}>{t('download.hub_hint')}</div>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

export default DownloadPage;
