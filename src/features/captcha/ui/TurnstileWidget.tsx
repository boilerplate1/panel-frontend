import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Turnstile as ReactTurnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { Loader2 } from 'lucide-react';
import { APP_CONFIG } from '@/shared/config';
import styles from './TurnstileWidget.module.css';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  action?: string;
}

export interface TurnstileWidgetRef {
  reset: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  ({ onSuccess, onExpire, onError, action = 'login' }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const turnstileRef = useRef<TurnstileInstance>(null);

    useImperativeHandle(ref, () => ({
      reset: () => turnstileRef.current?.reset(),
    }));

    return (
      <div className={styles.wrapper}>
        {!isLoaded && (
          <div className={styles.loaderWrapper}>
            <Loader2 className={styles.spinner} size={20} />
          </div>
        )}
        <ReactTurnstile
          ref={turnstileRef}
          siteKey={APP_CONFIG.RECAPTCHA_SITE_KEY}
          onSuccess={(token) => {
            setIsLoaded(true);
            onSuccess(token);
          }}
          onExpire={() => {
            onExpire?.();
          }}
          onError={() => {
            onError?.();
          }}
          onLoad={() => setIsLoaded(true)}
          options={{
            theme: 'dark',
            size: 'normal',
            action,
          }}
        />
      </div>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';
