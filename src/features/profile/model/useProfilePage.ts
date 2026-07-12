import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDevicesSuspenseQuery, useSubscriptionsSuspenseQuery } from '@/shared/api';
import { copyToClipboard } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/features/auth';
import { getSubscriptionDaysLeft, getSubscriptionState } from '../lib/profileSummary';
import { useUIStore } from '@/shared/lib';

export function useProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useUIStore();
  
  const {
    data: devices,
    refetch: refetchDevices,
  } = useDevicesSuspenseQuery();
  
  const {
    data: subscriptions,
    refetch: refetchSubscriptions,
  } = useSubscriptionsSuspenseQuery();

  const devicePreview = devices?.items?.slice(0, 3) ?? [];
  const devicesCount = devices?.total ?? devicePreview.length ?? 0;
  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;
  const deviceAvailability = activeSubscription?.deviceAvailability ?? null;
  const subscriptionState = getSubscriptionState(activeSubscription);
  const subscriptionDaysLeft = getSubscriptionDaysLeft(activeSubscription);

  const copySubscriptionLink = useCallback(() => {
    if (!activeSubscription?.remnaSubLink) {
      showToast(t('profile.link_unavailable'), 'error');
      return;
    }
    copyToClipboard(activeSubscription.remnaSubLink).then((success) => {
      if (success) {
        showToast(t('profile.copied'), 'success');
      } else {
        showToast(t('profile.copy_failed'), 'error');
      }
    });
  }, [activeSubscription, showToast, t]);

  const goToDevices = useCallback(() => navigate(ROUTES.DEVICES), [navigate]);
  const goToPayment = useCallback(() => navigate(ROUTES.CHECKOUT), [navigate]);
  const goToQuickConnect = useCallback(() => navigate(ROUTES.QUICK_CONNECT), [navigate]);

  return {
    user,
    devicePreview,
    devicesCount,
    activeSubscription,
    deviceAvailability,
    subscriptionState,
    subscriptionDaysLeft,
    copySubscriptionLink,
    goToDevices,
    goToPayment,
    goToQuickConnect,
    refetchDevices,
    refetchSubscriptions,
  };
}
