import { useState, useCallback, useRef } from 'react';
import { copyToClipboard } from '@/shared/lib';

interface UseClipboardOptions {
  timeout?: number;
}

interface UseClipboardReturn {
  copied: boolean;
  error: string | null;
  isCopying: boolean;
  copy: (text?: string) => Promise<boolean>;
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const copy = useCallback(
    async (text?: string) => {
      if (!text) return false;

      setIsCopying(true);
      setError(null);

      try {
        const success = await copyToClipboard(text);

        if (success) {
          setCopied(true);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setCopied(false), timeout);
        } else {
          setError('Failed to copy');
        }

        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to copy';
        setError(message);
        return false;
      } finally {
        setIsCopying(false);
      }
    },
    [timeout],
  );

  return { copied, error, isCopying, copy };
}
