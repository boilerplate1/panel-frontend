import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Turnstile as ReactTurnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { APP_CONFIG } from '@/shared/config';
import { getCurrentTheme, subscribeTheme, type Theme } from '@/shared/lib';
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
    const themeRef = useRef<Theme>(getCurrentTheme());
    const turnstileRef = useRef<TurnstileInstance>(null);

    useEffect(() => {
      return subscribeTheme((theme) => {
        themeRef.current = theme;
        turnstileRef.current?.reset();
      });
    }, []);

    useImperativeHandle(ref, () => ({
      reset: () => turnstileRef.current?.reset(),
    }));

    return (
      <div className={styles.wrapper}>
        <ReactTurnstile
          ref={turnstileRef}
          siteKey={APP_CONFIG.RECAPTCHA_SITE_KEY}
          onSuccess={onSuccess}
          onExpire={onExpire}
          onError={onError}
          options={{
            theme: themeRef.current,
            size: 'flexible',
            action,
          }}
        />
      </div>
    );
  },
);

TurnstileWidget.displayName = 'TurnstileWidget';
