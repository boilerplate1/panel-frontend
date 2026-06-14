import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Turnstile as ReactTurnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { Loader2 } from 'lucide-react';
import { APP_CONFIG } from '@/shared/config';

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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%',
        margin: '1rem 0', 
        padding: '8px',
        background: 'var(--surface-secondary, rgba(255, 255, 255, 0.05))',
        borderRadius: '12px',
        minHeight: '65px',
        position: 'relative'
      }}>
        {!isLoaded && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.3 }}>
            <Loader2 className="spinner" size={20} />
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
