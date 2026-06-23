/**
 * Все абсолютные пути приложения.
 * router.tsx использует только эти константы — никакого хардкода.
 */
export const ROUTES = {
  // Публичные
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILED: '/payment/failed',

  // Dashboard
  DASHBOARD: '/dashboard',
  DEVICES: '/dashboard/devices',
  HISTORY: '/dashboard/history',
  PAY: '/dashboard/pay',
  PAY_PROVIDER: '/dashboard/pay/provider',
  PAY_METHOD: '/dashboard/pay/method',
  PAY_STATUS: '/dashboard/pay/status',
  DASHBOARD_PAYMENT_SUCCESS: '/dashboard/payment/success',
  DASHBOARD_PAYMENT_FAILED: '/dashboard/payment/failed',
} as const;

export const ROUTE_PATTERNS = {
  PAY_PROVIDER: 'dashboard/pay/:planId/provider',
  PAY_METHOD: 'dashboard/pay/:planId/method/:provider',
  PAY_STATUS_INTENT: 'dashboard/pay/status/:intentId',
  DASHBOARD_REDIRECT: 'dashboard/*',
} as const;

export const buildPayProviderRoute = (planId: number) => `/dashboard/pay/${planId}/provider`;

export const buildPayMethodRoute = (planId: number, provider: string) =>
  `/dashboard/pay/${planId}/method/${provider.toLowerCase()}`;

export const buildPayStatusRoute = (intentId: string) => `/dashboard/pay/status/${intentId}`;
