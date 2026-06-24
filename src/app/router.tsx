/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { lazy } from 'react';
import { RequireAuth } from '@/app/guards/RequireAuth';
import { GuestOnly } from '@/app/guards/GuestOnly';
import { GlobalLayout } from '@/app/layouts/GlobalLayout';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { LazyLoad } from '@/shared/ui/LazyLoad/LazyLoad';
import { ROUTE_PATTERNS, ROUTES } from '@/shared/config';
import { buildLegacyPayRedirect } from '@/constants';

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

export const router = createBrowserRouter(
  [
    {
      path: ROUTES.HOME,
      element: <GlobalLayout />,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true,
          element: <Navigate to={ROUTES.DASHBOARD} replace />,
        },
        {
          path: ROUTES.PAYMENT_SUCCESS,
          element: (
            <LazyLoad>
              <PaymentResultPage />
            </LazyLoad>
          ),
        },
        {
          path: ROUTES.PAYMENT_FAILED,
          element: (
            <LazyLoad>
              <PaymentResultPage />
            </LazyLoad>
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
              handle: {
                title: 'dashboard.sidebar_profile',
                description: 'dashboard.profile_description',
              },
            },
            {
              path: ROUTES.DEVICES,
              element: <DevicesPage />,
              handle: {
                title: 'dashboard.sidebar_devices',
                description: 'dashboard.devices_description',
              },
            },
            {
              path: ROUTES.HISTORY,
              element: <TransactionPage />,
              handle: {
                title: 'dashboard.sidebar_history',
                description: 'dashboard.history_subtitle',
              },
            },
            {
              path: ROUTES.QUICK_CONNECT,
              element: (
                <LazyLoad>
                  <QuickConnectPage />
                </LazyLoad>
              ),
              handle: {
                title: 'Быстрое подключение',
                description: 'Happ Plus и v2rayTun в один клик',
              },
            },
            {
              path: ROUTE_PATTERNS.HISTORY_DETAIL,
              element: (
                <LazyLoad>
                  <TransactionDetailPage />
                </LazyLoad>
              ),
              handle: {
                title: 'dashboard.history_title',
                description: 'dashboard.history_subtitle',
              },
            },
            {
              path: ROUTES.CHECKOUT,
              element: (
                <LazyLoad>
                  <SubscriptionBuyPage />
                </LazyLoad>
              ),
              handle: {
                title: 'dashboard.buy_subscription_select',
                description: 'dashboard.buy_subscription_menu',
                hideSidebar: true,
              },
            },
            {
              path: ROUTE_PATTERNS.CHECKOUT_PROVIDER,
              element: (
                <LazyLoad>
                  <SubscriptionBuyPage />
                </LazyLoad>
              ),
              handle: {
                title: 'dashboard.buy_subscription_method_title',
                hideSidebar: true,
              },
            },
            {
              path: ROUTE_PATTERNS.CHECKOUT_PROVIDER_METHODS,
              element: (
                <LazyLoad>
                  <SubscriptionBuyPage />
                </LazyLoad>
              ),
              handle: {
                title: 'dashboard.buy_subscription_method_title',
                hideSidebar: true,
              },
            },
            {
              path: ROUTES.CHECKOUT_STATUS,
              element: (
                <LazyLoad>
                  <PaymentStatusPage />
                </LazyLoad>
              ),
              handle: {
                title: 'dashboard.buy_subscription_waiting',
                hideSidebar: true,
              },
            },
            {
              path: ROUTE_PATTERNS.CHECKOUT_STATUS_INTENT,
              element: (
                <LazyLoad>
                  <PaymentStatusPage />
                </LazyLoad>
              ),
              handle: {
                title: 'dashboard.buy_subscription_waiting',
                hideSidebar: true,
              },
            },
            {
              path: ROUTE_PATTERNS.LEGACY_PAY,
              element: <Navigate to={ROUTES.CHECKOUT} replace />,
            },
            {
              path: ROUTE_PATTERNS.LEGACY_PAY_PROVIDER,
              element: <LegacyPayRedirect />,
            },
            {
              path: ROUTE_PATTERNS.LEGACY_PAY_METHOD,
              element: <LegacyPayRedirect />,
            },
            {
              path: ROUTE_PATTERNS.LEGACY_PAY_STATUS,
              element: <Navigate to={ROUTES.CHECKOUT_STATUS} replace />,
            },
            {
              path: ROUTE_PATTERNS.LEGACY_PAY_STATUS_INTENT,
              element: <LegacyPayRedirect />,
            },
            {
              path: ROUTES.DASHBOARD_PAYMENT_SUCCESS,
              element: (
                <LazyLoad>
                  <PaymentResultPage />
                </LazyLoad>
              ),
              handle: {
                title: 'dashboard.payment_result_success_title',
                hideSidebar: true,
              },
            },
            {
              path: ROUTES.DASHBOARD_PAYMENT_FAILED,
              element: (
                <LazyLoad>
                  <PaymentResultPage />
                </LazyLoad>
              ),
              handle: {
                title: 'dashboard.payment_result_failed_title',
                hideSidebar: true,
              },
            },
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
                <LazyLoad>
                  <LoginPage />
                </LazyLoad>
              ),
              handle: { title: 'auth.login' },
            },
            {
              path: ROUTES.REGISTER,
              element: (
                <LazyLoad>
                  <RegisterPage />
                </LazyLoad>
              ),
              handle: { title: 'auth.register' },
            },
          ],
        },
        {
          path: '*',
          element: (
            <LazyLoad>
              <NotFoundPage />
            </LazyLoad>
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
