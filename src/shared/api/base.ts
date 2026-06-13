import axios from 'axios';
import { APP_CONFIG } from '@/shared/config';

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

    // List of endpoints that should NEVER trigger a token refresh on 401
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/client/login');

    const hasToken = !!localStorage.getItem('hypex_token');

    // 1. If unauthorized, not an auth endpoint, not already retrying, and we HAVE a token
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

        // Update header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        console.error('[Auth] Refresh failed permanently:', refreshError);

        // Network timeouts, backend restarts, and temporary 5xx responses should not
        // destroy a valid local session. Log out only when the server rejects refresh.
        if (hasToken && isAuthRejected(refreshError)) {
          console.warn('[Auth] Session lost. Logging out...');
          clearAccessToken();
          window.dispatchEvent(new Event('logout'));
        }
        return Promise.reject(refreshError);
      }
    }

    // 2. Handle specific 401/403 for blocked accounts or invalid credentials on login
    // If it's a login attempt and it failed with 401/403, just pass the error through
    // to the UI. The interceptor shouldn't do anything special here.

    throw error;
  },
);

// Helpers for unwrapping response data
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
