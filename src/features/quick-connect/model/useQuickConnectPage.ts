import { useNavigate } from 'react-router-dom';
import { useSubscriptionsQuery } from '@/shared/api';
import { copyToClipboard } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/features/auth';
import { useUIStore } from '@/shared/lib';

const APP_SCHEME = 'happ://import?url=';

export function useQuickConnectPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const { data: subscriptions, isLoading } = useSubscriptionsQuery(!!user);

  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;
  const subscriptionLink = activeSubscription?.remnaSubLink ?? '';
  const deeplinkHref = subscriptionLink
    ? `${APP_SCHEME}${encodeURIComponent(subscriptionLink)}`
    : '';

  const copyLink = () => {
    if (!subscriptionLink) {
      showToast('Ссылка недоступна', 'error');
      return;
    }
    copyToClipboard(subscriptionLink).then((success) => {
      if (success) {
        showToast('Ссылка скопирована', 'success');
      } else {
        showToast('Не удалось скопировать', 'error');
      }
    });
  };

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
