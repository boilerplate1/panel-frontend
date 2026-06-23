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
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const DevicesPage = lazy(() => import('@/pages/devices/DevicesPage'));
const TransactionPage = lazy(() => import('@/pages/transactions/TransactionPage'));

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
              path: ROUTES.PAY,
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
              path: ROUTES.PAY_STATUS,
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
              path: ROUTES.DASHBOARD_PAYMENT_SUCCESS,
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
              path: ROUTES.DASHBOARD_PAYMENT_FAILED,
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
