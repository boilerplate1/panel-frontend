import { Monitor, Smartphone, Laptop, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import styles from './SetupGuide.module.css';

type Platform = 'android' | 'ios' | 'windows' | 'macos';

const CLIENTS: Record<Platform, { name: string; url: string; store?: string }[]> = {
  android: [
    { name: 'Happ Proxy', url: 'https://play.google.com/store/apps/details?id=com.happproxy', store: 'Google Play' },
  ],
  ios: [
    { name: 'Happ Proxy', url: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215', store: 'App Store' },
    { name: 'v2rayTun', url: 'https://apps.apple.com/tr/app/v2raytun/id6476628951', store: 'App Store' },
  ],
  windows: [
    { name: 'Happ Proxy', url: 'https://happ.info/', store: 'happ.info' },
  ],
  macos: [
    { name: 'Happ Proxy', url: 'https://happ.info/', store: 'happ.info' },
  ],
};

const PLATFORM_LABELS: Record<Platform, string> = {
  android: 'Android',
  ios: 'iOS',
  windows: 'Windows',
  macos: 'macOS',
};

const PLATFORM_ICONS: Record<Platform, typeof Smartphone> = {
  android: Smartphone,
  ios: Smartphone,
  windows: Monitor,
  macos: Laptop,
};

interface SetupGuideProps {
  deeplinkHref: string;
  onCopyLink: () => void;
  onOpenApp: () => void;
}

export function SetupGuide({ deeplinkHref, onCopyLink, onOpenApp }: SetupGuideProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>('android');

  const clients = CLIENTS[activePlatform];

  return (
    <div className={styles.root}>
      <p className={styles.intro}>
        Скопируйте ссылку подписки, скачайте приложение на ваше устройство и откройте ссылку в нём — 
        всё настроится автоматически.
      </p>

      <div className={styles.copySection}>
        <button type="button" className={styles.copyBtn} onClick={onCopyLink}>
          <Copy size={18} />
          <span>Копировать ссылку подписки</span>
        </button>
      </div>

      <div className={styles.platformTabs}>
        {(Object.keys(PLATFORM_LABELS) as Platform[]).map((platform) => {
          const Icon = PLATFORM_ICONS[platform];
          return (
            <button
              key={platform}
              type="button"
              className={`${styles.platformTab} ${platform === activePlatform ? styles.platformTabActive : ''}`}
              onClick={() => setActivePlatform(platform)}
            >
              <Icon size={18} />
              <span>{PLATFORM_LABELS[platform]}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.platformContent}>
        <ol className={styles.stepsList}>
          <li className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <div className={styles.stepBody}>
              <span className={styles.stepLabel}>Скачайте приложение</span>
              <div className={styles.clientLinks}>
                {clients.map((client) => (
                  <a
                    key={client.name}
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.clientLink}
                  >
                    <ExternalLink size={16} />
                    <span>{client.name}</span>
                    <span className={styles.clientDesc}>{client.store}</span>
                  </a>
                ))}
              </div>
            </div>
          </li>
          <li className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepBody}>
              <span className={styles.stepLabel}>
                Скопируйте ссылку подписки — нажмите на кнопку «Копировать» выше
              </span>
            </div>
          </li>
          <li className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <div className={styles.stepBody}>
              <span className={styles.stepLabel}>
                Откройте приложение — подписка импортируется автоматически
              </span>
            </div>
          </li>
        </ol>

        <button
          type="button"
          className={styles.openBtn}
          onClick={onOpenApp}
          disabled={!deeplinkHref}
        >
          <ExternalLink size={18} />
          Открыть в Happ Proxy
        </button>
      </div>
    </div>
  );
}
