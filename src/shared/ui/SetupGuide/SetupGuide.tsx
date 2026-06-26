import { Monitor, Smartphone, Laptop, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import styles from './SetupGuide.module.css';

type Platform = 'android' | 'ios' | 'windows' | 'macos';

const CLIENTS: Record<Platform, { name: string; url: string; store?: string }[]> = {
  android: [
    {
      name: 'Happ Proxy',
      url: 'https://play.google.com/store/apps/details?id=com.happproxy',
      store: 'Google Play',
    },
  ],
  ios: [
    {
      name: 'Happ Proxy',
      url: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215',
      store: 'App Store',
    },
    {
      name: 'v2rayTun',
      url: 'https://apps.apple.com/tr/app/v2raytun/id6476628951',
      store: 'App Store',
    },
  ],
  windows: [{ name: 'Happ Proxy', url: 'https://happ.info/', store: 'happ.info' }],
  macos: [{ name: 'Happ Proxy', url: 'https://happ.info/', store: 'happ.info' }],
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

export function SetupGuide() {
  const [activePlatform, setActivePlatform] = useState<Platform>('android');

  const clients = CLIENTS[activePlatform];
  const PlatformIcon = PLATFORM_ICONS[activePlatform];

  return (
    <div className={styles.root}>
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
        <div className={styles.stepsTitle}>
          <PlatformIcon size={20} />
          <span>{PLATFORM_LABELS[activePlatform]}</span>
        </div>
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
              <span className={styles.stepLabel}>Скопируйте ссылку подписки из карточки выше</span>
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
      </div>
    </div>
  );
}
