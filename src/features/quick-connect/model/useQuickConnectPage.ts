import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionsQuery } from '@/shared/api';
import { useClipboard } from '@/shared/hooks';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

const APP_SCHEME = 'happ://import?url=';

export function useQuickConnectPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const { data: subscriptions, isLoading } = useSubscriptionsQuery(!!user);
  const { copy, copied } = useClipboard();

  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;
  const subscriptionLink = activeSubscription?.remnaSubLink ?? '';
  const deeplinkHref = subscriptionLink
    ? `${APP_SCHEME}${encodeURIComponent(subscriptionLink)}`
    : '';

  useEffect(() => {
    if (copied) showToast('Ссылка скопирована', 'success');
  }, [copied, showToast]);

  const copyLink = () => copy(subscriptionLink);

  const openApp = () => {
    if (!deeplinkHref) return;
    window.location.href = deeplinkHref;
  };

  return {
    user,
    isLoading,
    activeSubscription,
    subscriptionLink,
    deeplinkHref,
    copyLink,
    openApp,
    goToCheckout: () => navigate(ROUTES.CHECKOUT),
  };
}
