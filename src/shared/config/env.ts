import { getRuntimeEnv } from './runtimeEnv';

export const env = {
  API_URL: getRuntimeEnv('VITE_API_URL', import.meta.env.VITE_API_URL),
  TURNSTILE_SITE_KEY: getRuntimeEnv(
    'VITE_TURNSTILE_SITE_KEY',
    import.meta.env.VITE_TURNSTILE_SITE_KEY,
  ),
  ANDROID_APK_URL: getRuntimeEnv('VITE_ANDROID_APK_URL', import.meta.env.VITE_ANDROID_APK_URL),
  BASE_URL: getRuntimeEnv('VITE_BASE_URL', import.meta.env.VITE_BASE_URL),
} as const;
