/**
 * Absolute application routes.
 * Keep router paths and navigation builders in one place.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILED: '/payment/failed',

  DASHBOARD: '/dashboard',
  DEVICES: '/dashboard/devices',
  HISTORY: '/dashboard/history',
  CHECKOUT: '/dashboard/checkout',
  CHECKOUT_STATUS: '/dashboard/checkout/status',
  DASHBOARD_PAYMENT_SUCCESS: '/dashboard/payment/success',
  DASHBOARD_PAYMENT_FAILED: '/dashboard/payment/failed',
} as const;

export const ROUTE_PATTERNS = {
  CHECKOUT_PROVIDER: 'dashboard/checkout/:planId/provider',
  CHECKOUT_PROVIDER_METHODS: 'dashboard/checkout/:planId/provider/:provider',
  CHECKOUT_STATUS_INTENT: 'dashboard/checkout/status/:intentId',

  LEGACY_PAY: 'dashboard/pay',
  LEGACY_PAY_PROVIDER: 'dashboard/pay/:planId/provider',
  LEGACY_PAY_METHOD: 'dashboard/pay/:planId/provider/:provider',
  LEGACY_PAY_STATUS: 'dashboard/pay/status',
  LEGACY_PAY_STATUS_INTENT: 'dashboard/pay/status/:intentId',

  DASHBOARD_REDIRECT: 'dashboard/*',
} as const;

export const buildCheckoutProviderRoute = (planId: number) =>
  `/dashboard/checkout/${planId}/provider`;

export const buildCheckoutProviderMethodsRoute = (planId: number, provider: string) =>
  `/dashboard/checkout/${planId}/provider/${provider.toLowerCase()}`;

export const buildCheckoutStatusRoute = (intentId: string) =>
  `/dashboard/checkout/status/${intentId}`;

export const buildLegacyPayRedirect = (planId?: string, provider?: string, intentId?: string) => {
  if (intentId) return buildCheckoutStatusRoute(intentId);
  if (planId && provider) return `/dashboard/checkout/${planId}/provider/${provider.toLowerCase()}`;
  if (planId) return `/dashboard/checkout/${planId}/provider`;
  return ROUTES.CHECKOUT;
};
