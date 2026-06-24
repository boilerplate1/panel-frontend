import { ArrowRight, Copy, Download, Smartphone } from 'lucide-react';
import { Badge, Button, Card, SectionHeader } from '@/shared/ui';
import { formatDate } from '@/shared/lib';
import { useQuickConnectPage } from '../model/useQuickConnectPage';
import styles from './QuickConnectPage.module.css';

export default function QuickConnectPage() {
  const page = useQuickConnectPage();

  if (!page.user) return null;

  if (!page.activeSubscription) {
    return (
      <div className={styles.wrapper}>
        <Card padding="medium" className={styles.emptyCard}>
          <Badge variant="neutral">Нет подписки</Badge>
          <SectionHeader
            title="Нет доступной подписки"
            subtitle="Сначала оформите или продлите подписку, затем можно открыть deeplink."
            className={styles.header}
          />
          <Button className={styles.emptyBtn} onClick={page.goToCheckout}>
            <Download size={18} />
            К списку платежей
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.stack}>
        <Card padding="medium" className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div className={styles.summaryText}>
              <Badge variant="info">Deeplink</Badge>
              <SectionHeader
                title="Быстрое подключение"
                subtitle="Happ Plus и v2rayTun в один клик"
                className={styles.header}
              />
            </div>
            <div className={styles.summaryMeta}>
              <span>Активна до</span>
              <strong>{formatDate(page.activeSubscription.expiresAt)}</strong>
            </div>
          </div>

          <div className={styles.linkRow}>
            <Button type="button" variant="accentSoft" size="small" onClick={page.copyLink}>
              <Copy size={18} />
              Скопировать ссылку
            </Button>
            <div className={styles.linkText}>{page.subscriptionLink}</div>
          </div>
        </Card>

        <div className={styles.appsGrid}>
          {page.deeplinkApps.map((app) => (
            <Card key={app.key} padding="medium" className={styles.appCard}>
              <div className={styles.appTop}>
                <div className={styles.appIcon}>
                  <Smartphone size={18} />
                </div>
                <div className={styles.appText}>
                  <strong>{app.label}</strong>
                  <span>{app.description}</span>
                </div>
              </div>

              <div className={styles.appActions}>
                <Button
                  type="button"
                  variant="accentSoft"
                  size="small"
                  className={styles.appBtn}
                  onClick={() => page.openApp(app.href)}
                  disabled={!app.href}
                >
                  <ArrowRight size={18} />
                  Открыть
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
