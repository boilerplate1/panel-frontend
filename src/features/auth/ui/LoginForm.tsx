import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Button,
  FormField,
  FormError,
  TurnstileWidget,
  type TurnstileWidgetRef,
} from '@/shared/ui';
import { Loader2 } from 'lucide-react';
import { getApiErrorMessage } from '@/shared/lib';
import { authService } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { useAuth } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import styles from './AuthForm.module.css';

interface LoginFormProps {
  registrationEnabled?: boolean;
}

export function LoginForm({ registrationEnabled = true }: LoginFormProps) {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useUIStore();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetRef>(null);
  const isSubmitting = useRef(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading || isSubmitting.current) return;

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      setError(t('auth.error_required'));
      return;
    }

    if (!captchaToken) {
      setError(
        t('auth.captcha_required', 'Пожалуйста, подождите завершения проверки безопасности'),
      );
      return;
    }

    const currentToken = captchaToken;
    setCaptchaToken(null);
    setIsLoading(true);
    isSubmitting.current = true;
    setError(null);

    try {
      const data = await authService.loginWeb({
        username,
        password,
        captchaToken: currentToken,
      });

      authLogin(data.accessToken, data.user);
      showToast(t('auth.login_success'), 'success');
      navigate(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      let msg = getApiErrorMessage(err, t('auth.login_error'), t);

      const errorMsg = axios.isAxiosError(err) ? err.response?.data?.message || '' : '';
      if (typeof errorMsg === 'string' && errorMsg.startsWith('LOCKOUT_ACTIVE:')) {
        const minutes = errorMsg.split(':')[1] || '5';
        msg = t('auth.lockout_message', { minutes });
        showToast(t('auth.too_many_attempts'), 'error');
      }

      setError(msg);
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('auth.login')}</h1>
        <p className={styles.subtitle}>{t('auth.login_hint')}</p>
      </div>

      {error && <FormError message={error} className={styles.globalError} />}

      <form onSubmit={handleSubmit} className={styles.form} onChange={() => setError(null)}>
        <FormField
          name="username"
          label={t('auth.username')}
          placeholder="tonystark"
          required
          autoComplete="username"
          disabled={isLoading}
        />
        <FormField
          name="password"
          type="password"
          label={t('auth.password')}
          placeholder={t('auth.password_placeholder')}
          required
          autoComplete="current-password"
          showPasswordToggle
          disabled={isLoading}
        />

        <TurnstileWidget
          ref={turnstileRef}
          onSuccess={setCaptchaToken}
          onExpire={() => setCaptchaToken(null)}
          onError={() => setCaptchaToken(null)}
          action="login"
        />

        <Button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? <Loader2 className={styles.spinner} size={22} /> : t('auth.login')}
        </Button>
      </form>

      <div className={styles.footer}>
        <p>
          {t('auth.no_account')}{' '}
          {registrationEnabled && (
            <Link to={ROUTES.REGISTER} className={styles.link}>
              {t('auth.create_account')}
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
