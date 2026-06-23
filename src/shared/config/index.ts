import { env } from './env';
export { getRuntimeEnv } from './runtimeEnv';
export { ROUTE_PATTERNS, ROUTES, APP, SOCIAL_LINKS, SEO } from '@/constants';

export const EXTERNAL_CONFIG = {
  FLAG_CDN: 'https://flagcdn.com/w40',
} as const;

export const APP_CONFIG = {
  BRAND_NAME: 'Hypex',
  API_BASE_URL: env.API_URL,
  ANDROID_APK_URL: env.ANDROID_APK_URL,
  RECAPTCHA_SITE_KEY: env.TURNSTILE_SITE_KEY,
  BASE_URL: env.BASE_URL,
} as const;
