import axios from 'axios';

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type Translate = (key: string) => string;

export type ApiErrorKind = 'network' | 'not_found' | 'forbidden' | 'rate_limited' | 'unknown';

export function getApiErrorKind(error: unknown): ApiErrorKind {
  if (!axios.isAxiosError(error)) return 'unknown';

  if (isNetworkApiError(error)) return 'network';

  const status = error.response?.status;
  if (status === 404) return 'not_found';
  if (status === 403) return 'forbidden';
  if (status === 429) return 'rate_limited';

  return 'unknown';
}

export function getApiErrorMessage(error: unknown, fallback: string, t?: Translate): string {
  let message = fallback;

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (isNetworkApiError(error)) {
      return t ? t('shared.server_error') : 'Server error';
    }

    if (error.response?.status === 429) {
      return t ? t('shared.too_many_requests') : 'Too many requests. Please try again later.';
    }

    const data = error.response?.data;
    const rawMessage = data?.message || data?.error;

    if (Array.isArray(rawMessage)) {
      message = rawMessage
        .filter(Boolean)
        .map((m) => (t ? t(m) : m))
        .join('. ');
    } else if (typeof rawMessage === 'string' && rawMessage.trim()) {
      message = t ? t(rawMessage) : rawMessage;
    }
  } else if (error instanceof Error && error.message.trim()) {
    message = t ? t(error.message) : error.message;
  }

  return message;
}

function isNetworkApiError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;

  const message = error.message.toLowerCase();
  return (
    !error.response ||
    error.code === 'ECONNABORTED' ||
    message.includes('failed to connect') ||
    message.includes('network error') ||
    message.includes('timeout')
  );
}
