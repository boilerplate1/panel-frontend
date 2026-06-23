export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DEVICES: '/dashboard/devices',
  HISTORY: '/dashboard/history',
  PAY: '/dashboard/pay',
  PAY_PROVIDER: '/dashboard/pay/provider',
  PAY_METHOD: '/dashboard/pay/method',
  PAY_STATUS: '/dashboard/pay/status',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILED: '/payment/failed',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const ROUTE_PATTERNS = {
  PAY_PROVIDER: 'dashboard/pay/:planId/provider',
  PAY_METHOD: 'dashboard/pay/:planId/method/:provider',
  PAY_STATUS_INTENT: 'dashboard/pay/status/:intentId',
} as const;

export const buildPayProviderRoute = (planId: number) => `/dashboard/pay/${planId}/provider`;

export const buildPayMethodRoute = (planId: number, provider: string) =>
  `/dashboard/pay/${planId}/method/${provider.toLowerCase()}`;

export const buildPayStatusRoute = (intentId: string) => `/dashboard/pay/status/${intentId}`;
