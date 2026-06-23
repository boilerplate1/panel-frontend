import axios from 'axios';
import { APP_CONFIG } from '@/shared/config';
import { clearAccessToken, getStoredToken, saveAccessToken } from '@/shared/lib/authSession';

export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  withCredentials: true,
  timeout: 7000,
});

let refreshPromise: Promise<string> | null = null;

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

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = String(originalRequest?.url ?? '');

    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/client/login');

    const hasToken = !!getStoredToken();

    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      originalRequest &&
      !originalRequest._isRetry &&
      hasToken
    ) {
      originalRequest._isRetry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient.request(originalRequest);
      } catch (refreshError) {
        if (hasToken && isAuthRejected(refreshError)) {
          clearAccessToken();
          window.dispatchEvent(new Event('logout'));
        }
        return Promise.reject(refreshError);
      }
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
