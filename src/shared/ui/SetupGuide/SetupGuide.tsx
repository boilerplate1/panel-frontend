import { Monitor, Smartphone, Tablet, Laptop, Copy, ExternalLink, Download } from 'lucide-react';
import { useState } from 'react';
import styles from './SetupGuide.module.css';

type Platform = 'android' | 'ios' | 'windows' | 'macos';

const CLIENTS: Record<Platform, { name: string; url: string; description: string }[]> = {
  android: [
    { name: 'Happ Plus', url: 'https://happ-plus.com/download', description: 'Рекомендуемый клиент' },
    { name: 'v2rayTun', url: 'https://play.google.com/store/apps/details?id=com.v2raytun.android', description: 'Альтернативный клиент' },
  ],
  ios: [
    { name: 'Happ Plus', url: 'https://apps.apple.com/app/happ-plus/id654321', description: 'Рекомендуемый клиент' },
    { name: 'v2rayTun', url: 'https://apps.apple.com/app/v2raytun/id123456', description: 'Альтернативный клиент' },
  ],
  windows: [
    { name: 'v2rayTun', url: 'https://v2raytun.com/download/windows', description: 'Рекомендуемый клиент' },
    { name: 'Nekobox', url: 'https://github.com/MatsuriDayo/NekoBoxForWindows', description: 'С ручными настройками' },
  ],
  macos: [
    { name: 'v2rayTun', url: 'https://v2raytun.com/download/macos', description: 'Рекомендуемый клиент' },
    { name: 'Nekobox', url: 'https://github.com/MatsuriDayo/NekoBoxForWindows', description: 'С ручными настройками' },
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
  ios: Tablet,
  windows: Monitor,
  macos: Laptop,
};

interface SetupGuideProps {
  subscriptionLink: string;
  onCopyLink: () => void;
  onOpenApp: (href: string) => void;
}

export function SetupGuide({ subscriptionLink, onCopyLink, onOpenApp }: SetupGuideProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>('android');

  const clients = CLIENTS[activePlatform];
  const PlatformIcon = PLATFORM_ICONS[activePlatform];

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
        {subscriptionLink && (
          <span className={styles.copyHint}>Ссылка скопируется в буфер обмена</span>
        )}
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
        <div className={styles.steps}>
          <h4 className={styles.stepTitle}>
            <PlatformIcon size={18} />
            {PLATFORM_LABELS[activePlatform]}
          </h4>

          <ol className={styles.stepsList}>
            <li>
              <strong>Скачайте приложение</strong> — выберите один из клиентов ниже
              <div className={styles.clientLinks}>
                {clients.map((client) => (
                  <a
                    key={client.name}
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.clientLink}
                  >
                    <Download size={16} />
                    <span>{client.name}</span>
                    <span className={styles.clientDesc}>{client.description}</span>
                    <ExternalLink size={14} className={styles.externalIcon} />
                  </a>
                ))}
              </div>
            </li>
            <li>
              <strong>Скопируйте ссылку подписки</strong> — нажмите на кнопку «Копировать» выше
            </li>
            <li>
              <strong>Откройте приложение</strong> и вставьте ссылку — подключение настроится само
            </li>
          </ol>
        </div>

        <div className={styles.deeplinkBlock}>
          <h4 className={styles.deeplinkTitle}>Быстрый импорт</h4>
          <p className={styles.deeplinkText}>
            Если приложение уже установлено, нажмите «Открыть» — 
            подписка импортируется автоматически.
          </p>
          <div className={styles.deeplinkApps}>
            {(['happ', 'v2raytun'] as const).map((app) => {
              const scheme = app === 'happ' ? 'happ://import?url=' : 'v2raytun://import?url=';
              const label = app === 'happ' ? 'Happ Plus' : 'v2rayTun';
              return (
                <button
                  key={app}
                  type="button"
                  className={styles.deeplinkBtn}
                  onClick={() => onOpenApp(`${scheme}${encodeURIComponent(subscriptionLink)}`)}
                  disabled={!subscriptionLink}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
