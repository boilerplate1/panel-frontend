import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { PublicRoute } from '@/app/guards/PublicRoute';
import { GlobalLayout } from '@/app/layouts/GlobalLayout';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ROUTES } from '@/shared/config';
import { Loader2 } from 'lucide-react';
import styles from './PageLoader.module.css';

const LoginPage = lazy(() => import('@/pages/login/ui/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/register/ui/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/not-found/ui/NotFoundPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ui/ProfilePage'));
const DevicesPage = lazy(() => import('@/pages/devices/ui/DevicesPage'));
const BalanceHistoryPage = lazy(() => import('@/pages/balance-history/ui/BalanceHistoryPage'));
const SubscriptionBuyPage = lazy(() => import('@/pages/subscription-buy/ui/SubscriptionBuyPage'));

const PageLoader = () => (
  <div className={styles.wrapper}>
    <Loader2 className={`animate-spin ${styles.spinner}`} size={22} />
  </div>
);

const LazyLoad = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <GlobalLayout />,
    errorElement: (
      <LazyLoad>
        <NotFoundPage />
      </LazyLoad>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'my',
            element: (
              <LazyLoad>
                <ProfilePage />
              </LazyLoad>
            ),
            handle: { title: 'dashboard.sidebar_profile' },
          },
          {
            path: 'my/devices',
            element: (
              <LazyLoad>
                <DevicesPage />
              </LazyLoad>
            ),
            handle: { title: 'dashboard.sidebar_devices' },
          },
          {
            path: 'my/history',
            element: (
              <LazyLoad>
                <BalanceHistoryPage />
              </LazyLoad>
            ),
            handle: { title: 'dashboard.sidebar_history' },
          },
          {
            path: 'pay',
            element: (
              <LazyLoad>
                <SubscriptionBuyPage />
              </LazyLoad>
            ),
            handle: { hideSidebar: true, title: 'dashboard.buy_subscription_select' },
          },
        ],
      },
      {
        path: 'dashboard/*',
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        element: (
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
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
]);
