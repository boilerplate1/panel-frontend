import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionsQuery } from '@/shared/api';
import { useClipboard } from '@/shared/hooks';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

type QuickConnectApp = {
  key: 'happ' | 'v2raytun';
  label: string;
  description: string;
  scheme: string;
};

const APPS: QuickConnectApp[] = [
  {
    key: 'happ',
    label: 'Happ Plus',
    description: 'Быстрый импорт подписки через deeplink.',
    scheme: 'happ://import?url=',
  },
  {
    key: 'v2raytun',
    label: 'v2rayTun',
    description: 'Откроет подписку в клиенте в один клик.',
    scheme: 'v2raytun://import?url=',
  },
];

export function useQuickConnectPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const { data: subscriptions, isLoading } = useSubscriptionsQuery(!!user);
  const { copy, copied } = useClipboard();

  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;
  const subscriptionLink = activeSubscription?.remnaSubLink ?? '';

  const deeplinkApps = useMemo(
    () =>
      APPS.map((app) => ({
        ...app,
        href: subscriptionLink ? `${app.scheme}${encodeURIComponent(subscriptionLink)}` : '',
      })),
    [subscriptionLink],
  );

  useEffect(() => {
    if (copied) showToast('Ссылка скопирована', 'success');
  }, [copied, showToast]);

  const copyLink = () => copy(subscriptionLink);

  const openApp = (href: string) => {
    if (!href) return;
    window.location.href = href;
  };

  return {
    user,
    isLoading,
    activeSubscription,
    subscriptionLink,
    deeplinkApps,
    copyLink,
    openApp,
    goToCheckout: () => navigate(ROUTES.CHECKOUT),
  };
}
