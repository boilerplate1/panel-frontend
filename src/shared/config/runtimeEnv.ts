type RuntimeConfig = Partial<{
  VITE_API_URL: string;
  VITE_TURNSTILE_SITE_KEY: string;
  VITE_ANDROID_APK_URL: string;
  VITE_BASE_URL: string;
}>;

declare global {
  interface Window {
    __HYPEX_CONFIG__?: RuntimeConfig;
  }
}

const runtimeConfig = typeof window === 'undefined' ? undefined : window.__HYPEX_CONFIG__;

export const getRuntimeEnv = (key: keyof RuntimeConfig, fallback?: string) => {
  const value = runtimeConfig?.[key] || fallback;
  return value ?? '';
};
