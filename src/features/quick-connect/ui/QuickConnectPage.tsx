import { Download } from 'lucide-react';
import { Badge, Button, Card, SectionHeader } from '@/shared/ui';
import { SetupGuide } from '@/shared/ui';
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
            subtitle="Сначала оформите или продлите подписку."
            className={styles.header}
          />
          <Button className={styles.emptyBtn} onClick={page.goToCheckout}>
            <Download size={18} />К списку платежей
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Card padding="medium" className={styles.card}>
        <SectionHeader
          title="Подключение"
          subtitle="Скопируйте ссылку и откройте в приложении — всё настроится автоматически"
          className={styles.header}
        />
        <div className={styles.expiresRow}>
          <span className={styles.expiresLabel}>Активна до</span>
          <strong className={styles.expiresValue}>{formatDate(page.activeSubscription.expiresAt)}</strong>
        </div>
      </Card>

      <Card padding="medium" className={styles.card}>
        <SetupGuide
          deeplinkHref={page.deeplinkHref}
          onCopyLink={page.copyLink}
          onOpenApp={page.openApp}
        />
      </Card>
    </div>
  );
}
