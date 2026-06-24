import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDevicesQuery, useSubscriptionsQuery } from '@/shared/api';
import { copyToClipboard } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/stores/authStore';
import { getSubscriptionDaysLeft, getSubscriptionState } from '../lib/profileSummary';
import { useUIStore } from '@/stores/uiStore';

export function useProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useUIStore();
  const { data: devices, isLoading: devicesLoading } = useDevicesQuery(!!user);
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptionsQuery(!!user);

  const devicePreview = devices?.items?.slice(0, 3) ?? [];
  const activeSubscription =
    subscriptions?.find((sub) => sub.status === 'ACTIVE' || sub.status === 'active') ?? null;
  const deviceAvailability = activeSubscription?.deviceAvailability ?? null;
  const subscriptionState = getSubscriptionState(activeSubscription);
  const subscriptionDaysLeft = getSubscriptionDaysLeft(activeSubscription);

  const copySubscriptionLink = async () => {
    if (!activeSubscription?.remnaSubLink) return;

    const success = await copyToClipboard(activeSubscription.remnaSubLink);
    if (success) {
      showToast(t('profile.copied'), 'success');
    }
  };

  return {
    user,
    devicePreview,
    devicesLoading,
    subscriptionsLoading,
    activeSubscription,
    deviceAvailability,
    subscriptionState,
    subscriptionDaysLeft,
    copySubscriptionLink,
    goToDevices: () => navigate(ROUTES.DEVICES),
    goToPayment: () => navigate(ROUTES.CHECKOUT),
  };
}
