export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/my',
  DEVICES: '/my/devices',
  HISTORY: '/my/history',
  PAY: '/pay',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const SOCIAL_LINKS = {
  TG_CHANNEL: 'https://t.me/hypex_vpn',
  TG_JOB: 'https://t.me/hypex_team_job',
  SUPPORT_EMAIL: 'support@hypex.web',
} as const;

export const EXTERNAL_CONFIG = {
  FLAG_CDN: 'https://flagcdn.com/w40',
} as const;

export const APP_CONFIG = {
  BRAND_NAME: 'Hypex',
  API_BASE_URL: import.meta.env.VITE_API_URL,
  ANDROID_APK_URL: import.meta.env.VITE_ANDROID_APK_URL,
  RECAPTCHA_SITE_KEY:
    import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Le4KR4tAAAAADWC6zRe_vYosJMqDttFjiGSCNv7',
  BASE_URL: import.meta.env.VITE_BASE_URL,
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
