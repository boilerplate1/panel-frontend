import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { PublicRoute } from '@/app/guards/PublicRoute';
import { GlobalLayout } from '@/app/layouts/GlobalLayout';
import { MainLayout } from '@/app/layouts/MainLayout';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { Loader2 } from 'lucide-react';
import styles from './PageLoader.module.css';

// Lazy loading all pages for better performance and smaller initial bundle
const LandingPage = lazy(() => import('@/pages/landing/ui/LandingPageNew'));
const LoginPage = lazy(() => import('@/pages/login/ui/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/register/ui/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/not-found/ui/NotFoundPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ui/ProfilePage'));
const DevicesPage = lazy(() => import('@/pages/devices/ui/DevicesPage'));
const BalanceHistoryPage = lazy(() => import('@/pages/balance-history/ui/BalanceHistoryPage'));
const SubscriptionBuyPage = lazy(() => import('@/pages/subscription-buy/ui/SubscriptionBuyPage'));
const GiftPage = lazy(() => import('@/pages/gift/ui/GiftPage'));
const DownloadPage = lazy(() => import('@/pages/download/ui/DownloadPage'));

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
    path: '/',
    element: <GlobalLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <LazyLoad>
                <LandingPage />
              </LazyLoad>
            ),
          },
          {
            path: 'download',
            element: (
              <LazyLoad>
                <DownloadPage />
              </LazyLoad>
            ),
          },
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            ),
            children: [
              { index: true, element: <Navigate to="/dashboard/profile" replace /> },
              {
                path: 'profile',
                element: (
                  <LazyLoad>
                    <ProfilePage />
                  </LazyLoad>
                ),
                handle: { title: 'dashboard.sidebar_profile' },
              },
              {
                path: 'devices',
                element: (
                  <LazyLoad>
                    <DevicesPage />
                  </LazyLoad>
                ),
                handle: { title: 'dashboard.sidebar_devices' },
              },
              {
                path: 'balance/history',
                element: (
                  <LazyLoad>
                    <BalanceHistoryPage />
                  </LazyLoad>
                ),
                handle: { title: 'dashboard.sidebar_history' },
              },
              {
                path: 'subscription/buy',
                element: (
                  <LazyLoad>
                    <SubscriptionBuyPage />
                  </LazyLoad>
                ),
                handle: { hideSidebar: true, title: 'dashboard.buy_subscription_select' },
              },
              { path: 'balance', element: <Navigate to="/dashboard/subscription/buy" replace /> },
            ],
          },
        ],
      },
      {
        path: '/dashboard/top-up',
        element: <Navigate to="/dashboard/subscription/buy" replace />,
      },
      {
        path: '/dashboard/top-up/history',
        element: <Navigate to="/dashboard/balance/history" replace />,
      },
      {
        path: '/gift/:template?',
        element: (
          <ProtectedRoute>
            <LazyLoad>
              <GiftPage />
            </LazyLoad>
          </ProtectedRoute>
        ),
      },
      {
        element: (
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        ),
        children: [
          {
            path: '/login',
            element: (
              <LazyLoad>
                <LoginPage />
              </LazyLoad>
            ),
          },
          {
            path: '/register',
            element: (
              <LazyLoad>
                <RegisterPage />
              </LazyLoad>
            ),
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
