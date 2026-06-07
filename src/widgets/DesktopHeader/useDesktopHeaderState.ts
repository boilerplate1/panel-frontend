import { useLocation, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSubscriptionsQuery } from '@/entities/subscription';

interface UseDesktopHeaderStateParams {
  isLoggedIn: boolean;
}

export function useDesktopHeaderState({ isLoggedIn }: UseDesktopHeaderStateParams) {
  const location = useLocation();
  const matches = useMatches();
  const { t } = useTranslation();
  const { data: subscriptions } = useSubscriptionsQuery(isLoggedIn);

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLanding = location.pathname === '/' || location.pathname === '/download';
  const canGoBack =
    location.pathname !== '/' &&
    location.pathname !== '/download' &&
    location.pathname !== '/dashboard/profile';

  const currentMatch = matches[matches.length - 1];
  const titleKey = (currentMatch?.handle as { title?: string })?.title;
  const pageTitle = titleKey ? t(titleKey) : '';
  const drawerTitle =
    titleKey ? t(titleKey) : location.pathname === '/dashboard/profile' ? t('dashboard.sidebar_profile') : t('shared.menu');
  const activeSubscription = subscriptions?.find((subscription) => subscription.status.toLowerCase() === 'active');

  return {
    location,
    isDashboard,
    isLanding,
    canGoBack,
    pageTitle,
    drawerTitle,
    activeSubscription,
  };
}
