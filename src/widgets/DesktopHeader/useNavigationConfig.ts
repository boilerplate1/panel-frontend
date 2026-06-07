import { useTranslation } from 'react-i18next';
import { CreditCard, Download, History, Mail, MonitorSmartphone, User } from 'lucide-react';
import type { DesktopHeaderNavItem } from './DesktopHeaderDrawer';

export function useNavigationConfig(isLoggedIn: boolean, activeSubscription: boolean) {
  const { t } = useTranslation();

  const mainNavItems: DesktopHeaderNavItem[] = [
    { label: t('navbar.download'), path: '/download', icon: Download },
    {
      label: t('navbar.buy'),
      path: '/dashboard/subscription/buy',
      icon: CreditCard,
    },
    { label: t('navbar.contact'), path: '/#contacts', icon: Mail },
  ];

  if (isLoggedIn) {
    mainNavItems.unshift({ label: t('footer.profile'), path: '/dashboard/profile', icon: User });
  }

  const dashboardNavItems: DesktopHeaderNavItem[] = [
    { label: t('dashboard.sidebar_profile'), path: '/dashboard/profile', icon: User },
    { label: t('dashboard.sidebar_devices'), path: '/dashboard/devices', icon: MonitorSmartphone },
    { label: t('dashboard.sidebar_history'), path: '/dashboard/balance/history', icon: History },
    {
      label: activeSubscription ? t('navbar.renew_subscription') : t('navbar.purchase_subscription'),
      path: '/dashboard/subscription/buy',
      icon: CreditCard,
    },
  ];

  return { mainNavItems, dashboardNavItems };
}
