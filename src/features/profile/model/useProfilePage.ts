import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDevicesQuery, useSubscriptionsQuery } from '@/shared/api';
import { useClipboard } from '@/shared/hooks';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/stores/authStore';
import { getSubscriptionDaysLeft, getSubscriptionState } from '../lib/profileSummary';
import { useUIStore } from '@/stores/uiStore';

export function useProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useUIStore();
  const { copy, copied } = useClipboard();
  const {
    data: devices,
    isLoading: devicesLoading,
    isError: devicesError,
    refetch: refetchDevices,
  } = useDevicesQuery(!!user);
  const {
    data: subscriptions,
    isLoading: subscriptionsLoading,
    isError: subscriptionsError,
    refetch: refetchSubscriptions,
  } = useSubscriptionsQuery(!!user);

  const devicePreview = devices?.items?.slice(0, 3) ?? [];
  const devicesCount = devices?.total ?? devicePreview.length ?? 0;
  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;
  const deviceAvailability = activeSubscription?.deviceAvailability ?? null;
  const subscriptionState = getSubscriptionState(activeSubscription);
  const subscriptionDaysLeft = getSubscriptionDaysLeft(activeSubscription);

  useEffect(() => {
    if (copied) showToast(t('profile.copied'), 'success');
  }, [copied, showToast, t]);

  const copySubscriptionLink = () => copy(activeSubscription?.remnaSubLink);

  return {
    user,
    devicePreview,
    devicesCount,
    devicesLoading,
    devicesError,
    subscriptionsLoading,
    subscriptionsError,
    activeSubscription,
    deviceAvailability,
    subscriptionState,
    subscriptionDaysLeft,
    copySubscriptionLink,
    goToDevices: () => navigate(ROUTES.DEVICES),
    goToPayment: () => navigate(ROUTES.CHECKOUT),
    goToQuickConnect: () => navigate(ROUTES.QUICK_CONNECT),
    refetchDevices,
    refetchSubscriptions,
  };
}
