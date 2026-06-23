/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { RequireAuth } from '@/app/guards/RequireAuth';
import { GuestOnly } from '@/app/guards/GuestOnly';
import { GlobalLayout } from '@/app/layouts/GlobalLayout';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { LazyLoad } from '@/shared/ui/LazyLoad/LazyLoad';
import { ROUTE_PATTERNS, ROUTES } from '@/shared/config';

const LoginPage = lazy(() => import('@/pages/login/ui/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/register/ui/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/not-found/ui/NotFoundPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ui/ProfilePage'));
const DevicesPage = lazy(() => import('@/pages/devices/ui/DevicesPage'));
const TransactionPage = lazy(() => import('@/pages/transactions/ui/TransactionPage'));

const SubscriptionBuyPage = lazy(() => import('@/pages/subscription-buy/ui/SubscriptionBuyPage'));
const PaymentStatusPage = lazy(() => import('@/pages/payment-status/ui/PaymentStatusPage'));
const PaymentResultPage = lazy(() => import('@/pages/payment-result/ui/PaymentResultPage'));

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
          path: 'payment/success',
          element: (
            <LazyLoad>
              <PaymentResultPage />
            </LazyLoad>
          ),
        },
        {
          path: 'payment/failed',
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
              path: 'dashboard',
              element: <ProfilePage />,
              handle: {
                title: 'dashboard.sidebar_profile',
                description: 'dashboard.profile_description',
              },
            },
            {
              path: 'dashboard/devices',
              element: <DevicesPage />,
              handle: {
                title: 'dashboard.sidebar_devices',
                description: 'dashboard.devices_description',
              },
            },
            {
              path: 'dashboard/history',
              element: <TransactionPage />,
              handle: {
                title: 'dashboard.sidebar_history',
                description: 'dashboard.history_subtitle',
              },
            },
            
            {
              path: 'dashboard/pay',
              element: (
                <LazyLoad>
                  <SubscriptionBuyPage />
                </LazyLoad>
              ),
              handle: {
                hideSidebar: true,
                title: 'dashboard.buy_subscription_select',
                description: 'dashboard.buy_subscription_menu',
              },
            },
            {
              path: ROUTE_PATTERNS.PAY_PROVIDER,
              element: (
                <LazyLoad>
                  <SubscriptionBuyPage />
                </LazyLoad>
              ),
              handle: {
                hideSidebar: true,
                title: 'dashboard.buy_subscription_method_title',
              },
            },
            {
              path: ROUTE_PATTERNS.PAY_METHOD,
              element: (
                <LazyLoad>
                  <SubscriptionBuyPage />
                </LazyLoad>
              ),
              handle: {
                hideSidebar: true,
                title: 'dashboard.buy_subscription_method_title',
              },
            },
            {
              path: 'dashboard/pay/status',
              element: (
                <LazyLoad>
                  <PaymentStatusPage />
                </LazyLoad>
              ),
              handle: {
                hideSidebar: true,
                title: 'dashboard.buy_subscription_waiting',
              },
            },
            {
              path: ROUTE_PATTERNS.PAY_STATUS_INTENT,
              element: (
                <LazyLoad>
                  <PaymentStatusPage />
                </LazyLoad>
              ),
              handle: {
                hideSidebar: true,
                title: 'dashboard.buy_subscription_waiting',
              },
            },
            {
              path: 'dashboard/payment/success',
              element: (
                <LazyLoad>
                  <PaymentResultPage />
                </LazyLoad>
              ),
              handle: {
                hideSidebar: true,
                title: 'dashboard.payment_result_success_title',
              },
            },
            {
              path: 'dashboard/payment/failed',
              element: (
                <LazyLoad>
                  <PaymentResultPage />
                </LazyLoad>
              ),
              handle: {
                hideSidebar: true,
                title: 'dashboard.payment_result_failed_title',
              },
            },
          ],
        },
        {
          path: 'dashboard/*',
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
              path: 'login',
              element: (
                <LazyLoad>
                  <LoginPage />
                </LazyLoad>
              ),
              handle: { title: 'auth.login' },
            },
            {
              path: 'register',
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
