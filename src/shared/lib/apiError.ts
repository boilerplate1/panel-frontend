import axios from 'axios';

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type Translate = (key: string) => string;

export function getApiErrorMessage(error: unknown, fallback: string, t?: Translate): string {
  let message = fallback;

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (isNetworkApiError(error)) {
      return t ? t('shared.server_error') : 'Server error';
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
