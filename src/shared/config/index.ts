import { env } from './env';
export { getRuntimeEnv } from './runtimeEnv';
export {
  ROUTES,
  ROUTE_PATTERNS,
  buildCheckoutProviderMethodsRoute,
  buildCheckoutProviderRoute,
  buildCheckoutStatusRoute,
  buildLegacyPayRedirect,
} from './routes';
export { APP } from './app';
export { SOCIAL_LINKS } from './social';
export { SEO } from './seo';
export { PAYMENT_METHOD_ICONS, YOOKASSA_PAYMENT_METHODS } from './payment-icons';
export type { YookassaPaymentMethod } from './payment-icons';

export const EXTERNAL_CONFIG = {
  FLAG_CDN: 'https://flagcdn.com/w40',
} as const;

export const APP_CONFIG = {
  BRAND_NAME: 'Hypex',
  API_BASE_URL: env.API_URL,
  ANDROID_APK_URL: env.ANDROID_APK_URL,
  RECAPTCHA_SITE_KEY: env.TURNSTILE_SITE_KEY,
  RECAPTCHA_ENABLED: env.TURNSTILE_ENABLED && !!env.TURNSTILE_SITE_KEY,
  BASE_URL: env.BASE_URL,
} as const;
