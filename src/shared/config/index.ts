export const APP_CONFIG = {
  BRAND_NAME: 'Hypex',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://api.hypex.biz/api',
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
