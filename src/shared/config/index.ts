const PROD_API_URL = 'https://api.hypex.biz/api';
const LOCAL_API_URL = 'http://localhost:8081/api';

const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocalFrontend = hostname === 'localhost' || hostname === '127.0.0.1';
const envApiUrl = import.meta.env.VITE_API_URL;
const isLocalApiUrl =
  typeof envApiUrl === 'string' && /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(envApiUrl);

const API_BASE_URL = isLocalFrontend ? envApiUrl || LOCAL_API_URL : isLocalApiUrl ? PROD_API_URL : envApiUrl || PROD_API_URL;

export const APP_CONFIG = {
  BRAND_NAME: 'Hypex',
  API_BASE_URL,
  ANDROID_APK_URL: import.meta.env.VITE_ANDROID_APK_URL || '/downloads/hypexvpn.apk',
  TG_CHANNEL: 'https://t.me/hypex_vpn',
  TG_JOB: 'https://t.me/hypex_team_job',
  SUPPORT_EMAIL: 'support@hypex.web',
} as const;

export const SEO_CONFIG = {
  KEYWORDS: [
    'купить впн',
    'впн россия',
    'бесплатно впн',
    'впн для андроид',
    'впн для айос',
    'впн для пк',
    'впн для тв',
    'fast vpn russia',
    'secure vpn for android',
    'vpn for iphone',
    'vpn for macos',
    'vpn for windows',
  ].join(', '),
} as const;
