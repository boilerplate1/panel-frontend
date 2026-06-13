export const APP_CONFIG = {
  BRAND_NAME: 'Hypex',
  // Fallback API URL (used if gateway discovery fails)
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://api.hypex.biz/api',
  // Public link to the file on Yandex Disk containing the current gateway URL
  GATEWAY_CONFIG_URL: import.meta.env.VITE_GATEWAY_URL || 'https://disk.yandex.ru/i/ВАШ_КОД_ЗДЕСЬ',
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
