import axios from 'axios';
import { APP_CONFIG } from '@/shared/config';
import { useUIStore } from '@/shared/lib/store';

export const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  withCredentials: true,
  timeout: 7000,
});

let refreshPromise: Promise<string> | null = null;

function saveAccessToken(token: string) {
  localStorage.setItem('hypex_token', token);
  const rawStore = localStorage.getItem('auth-storage');
  if (!rawStore) return;
  try {
    const parsed = JSON.parse(rawStore);
    if (parsed.state) {
      parsed.state.accessToken = token;
      localStorage.setItem('auth-storage', JSON.stringify(parsed));
    }
  } catch {
    localStorage.removeItem('auth-storage');
  }
}

function clearAccessToken() {
  localStorage.removeItem('hypex_token');
}

function isAuthRejected(error: unknown) {
  return axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0);
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ accessToken: string }>(
        `${APP_CONFIG.API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true, timeout: 7000 },
      )
      .then((response) => {
        const token = response.data.accessToken;
        saveAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hypex_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = String(originalRequest?.url ?? '');

    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/client/login');

    const hasToken = !!localStorage.getItem('hypex_token');

    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      originalRequest &&
      !originalRequest._isRetry &&
      hasToken
    ) {
      originalRequest._isRetry = true;

      try {
        console.log('[Auth] Access token expired, attempting refresh...');
        const newToken = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        console.error('[Auth] Refresh failed permanently:', refreshError);

        if (hasToken && isAuthRejected(refreshError)) {
          console.warn('[Auth] Session lost. Logging out...');
          clearAccessToken();
          window.dispatchEvent(new Event('logout'));
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 429) {
      useUIStore.getState().showToast(
        'Too many requests. Please wait before retrying.',
        'error',
      );
    }

    throw error;
  },
);

export function unwrapArray<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of keys) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}

export function unwrapObject<T>(payload: unknown, fallback: T): T {
  if (payload && typeof payload === 'object') return payload as T;
  return fallback;
}
