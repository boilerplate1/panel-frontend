/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader } from '@/shared/ui';
import { RequireAuth } from '@/app/guards/RequireAuth';
import { GuestOnly } from '@/app/guards/GuestOnly';
import { GlobalLayout } from '@/app/layouts/GlobalLayout';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ROUTE_PATTERNS, ROUTES } from '@/shared/config';
import { buildLegacyPayRedirect } from '@/shared/config';

const LoginPage = lazy(() => import('@/pages/login/ui/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/register/ui/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/not-found/ui/NotFoundPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const DevicesPage = lazy(() => import('@/pages/devices/DevicesPage'));
const TransactionPage = lazy(() => import('@/pages/transactions/TransactionPage'));
const TransactionDetailPage = lazy(() => import('@/pages/transactions/TransactionDetailPage'));
const QuickConnectPage = lazy(() => import('@/pages/connect/QuickConnectPage'));
const SubscriptionBuyPage = lazy(() => import('@/pages/payment/SubscriptionBuyPage'));
const PaymentStatusPage = lazy(() => import('@/pages/payment/PaymentStatusPage'));
const PaymentResultPage = lazy(() => import('@/pages/payment/PaymentResultPage'));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

const withSidebar = (title: string, description?: string) => ({
  title,
  ...(description && { description }),
});
const withoutSidebar = (title: string, description?: string) => ({
  title,
  ...(description && { description }),
  hideSidebar: true,
});

export const router = createBrowserRouter(
  [
    {
      path: ROUTES.HOME,
      element: <GlobalLayout />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
        {
          path: ROUTES.PAYMENT_SUCCESS,
          element: (
            <Lazy>
              <PaymentResultPage />
            </Lazy>
          ),
        },
        {
          path: ROUTES.PAYMENT_FAILED,
          element: (
            <Lazy>
              <PaymentResultPage />
            </Lazy>
          ),
        },
        {
          element: (
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          ),
          children: [
            {
              path: ROUTES.DASHBOARD,
              element: <ProfilePage />,
              handle: withSidebar('dashboard.sidebar_profile', 'dashboard.profile_description'),
            },
            {
              path: ROUTES.DEVICES,
              element: <DevicesPage />,
              handle: withSidebar('dashboard.sidebar_devices', 'dashboard.devices_description'),
            },
            {
              path: ROUTES.HISTORY,
              element: <TransactionPage />,
              handle: withSidebar('dashboard.sidebar_history', 'dashboard.history_subtitle'),
            },
            {
              path: ROUTE_PATTERNS.HISTORY_DETAIL,
              element: <TransactionDetailPage />,
              handle: withSidebar('dashboard.history_title', 'dashboard.history_subtitle'),
            },
            {
              path: ROUTES.QUICK_CONNECT,
              element: <QuickConnectPage />,
              handle: withoutSidebar('Быстрое подключение', 'Happ Plus и v2rayTun в один клик'),
            },
            {
              path: ROUTES.CHECKOUT,
              element: <SubscriptionBuyPage />,
              handle: withoutSidebar(
                'dashboard.buy_subscription_select',
                'dashboard.buy_subscription_menu',
              ),
            },
            {
              path: ROUTE_PATTERNS.CHECKOUT_PROVIDER,
              element: <SubscriptionBuyPage />,
              handle: withoutSidebar('dashboard.buy_subscription_method_title'),
            },
            {
              path: ROUTE_PATTERNS.CHECKOUT_PROVIDER_METHODS,
              element: <SubscriptionBuyPage />,
              handle: withoutSidebar('dashboard.buy_subscription_method_title'),
            },
            {
              path: ROUTES.CHECKOUT_STATUS,
              element: <PaymentStatusPage />,
              handle: withoutSidebar('dashboard.buy_subscription_waiting'),
            },
            {
              path: ROUTE_PATTERNS.CHECKOUT_STATUS_INTENT,
              element: <PaymentStatusPage />,
              handle: withoutSidebar('dashboard.buy_subscription_waiting'),
            },
            {
              path: ROUTES.DASHBOARD_PAYMENT_SUCCESS,
              element: <PaymentResultPage />,
              handle: withoutSidebar('dashboard.payment_result_success_title'),
            },
            {
              path: ROUTES.DASHBOARD_PAYMENT_FAILED,
              element: <PaymentResultPage />,
              handle: withoutSidebar('dashboard.payment_result_failed_title'),
            },
            { path: ROUTE_PATTERNS.LEGACY_PAY, element: <Navigate to={ROUTES.CHECKOUT} replace /> },
            { path: ROUTE_PATTERNS.LEGACY_PAY_PROVIDER, element: <LegacyPayRedirect /> },
            { path: ROUTE_PATTERNS.LEGACY_PAY_METHOD, element: <LegacyPayRedirect /> },
            {
              path: ROUTE_PATTERNS.LEGACY_PAY_STATUS,
              element: <Navigate to={ROUTES.CHECKOUT_STATUS} replace />,
            },
            { path: ROUTE_PATTERNS.LEGACY_PAY_STATUS_INTENT, element: <LegacyPayRedirect /> },
          ],
        },
        {
          path: ROUTE_PATTERNS.DASHBOARD_REDIRECT,
          element: <Navigate to={ROUTES.DASHBOARD} replace />,
        },
        {
          element: (
            <GuestOnly>
              <AuthLayout />
            </GuestOnly>
          ),
          children: [
            {
              path: ROUTES.LOGIN,
              element: (
                <Lazy>
                  <LoginPage />
                </Lazy>
              ),
              handle: { title: 'auth.login' },
            },
            {
              path: ROUTES.REGISTER,
              element: (
                <Lazy>
                  <RegisterPage />
                </Lazy>
              ),
              handle: { title: 'auth.register' },
            },
          ],
        },
        {
          path: '*',
          element: (
            <Lazy>
              <NotFoundPage />
            </Lazy>
          ),
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL ?? '/' },
);

function LegacyPayRedirect() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const intentId = params.intentId ?? searchParams.get('intentId') ?? undefined;

  return <Navigate to={buildLegacyPayRedirect(params.planId, params.provider, intentId)} replace />;
}
