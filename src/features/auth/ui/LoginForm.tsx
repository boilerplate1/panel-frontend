import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, FormField, FormError, CaptchaModal } from '@/shared/ui';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../model/useAuth';
import { useUIStore, getApiErrorMessage } from '@/shared/lib';
import { authApi } from '@/shared/api';
import { APP_CONFIG, ROUTES } from '@/shared/config';
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
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      setError(t('auth.error_required'));
      return;
    }

    setError(null);
    setPendingData({ username, password });
    setShowCaptcha(true);
  };

  const handleCaptchaVerify = async (token: string) => {
    setShowCaptcha(false);
    if (!pendingData) return;

    setIsLoading(true);
    try {
      const data = await authApi.loginWeb({ 
        ...pendingData,
        captchaToken: token 
      });

      authLogin(data.accessToken, data.user);
      showToast(t('auth.login_success'), 'success');
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      let msg = getApiErrorMessage(err, t('auth.login_error'), t);
      
      const errorMsg = err.response?.data?.message || '';
      if (typeof errorMsg === 'string' && errorMsg.startsWith('LOCKOUT_ACTIVE:')) {
        const minutes = errorMsg.split(':')[1] || '5';
        msg = t('auth.lockout_message', { minutes });
        showToast(t('auth.too_many_attempts'), 'error');
      }
      
      setError(msg);
    } finally {
      setIsLoading(false);
      setPendingData(null);
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

        <Button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className={styles.spinner} size={22} />
          ) : (
            t('auth.login')
          )}
        </Button>
      </form>

      <CaptchaModal
        isOpen={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        onVerify={handleCaptchaVerify}
        siteKey={APP_CONFIG.RECAPTCHA_SITE_KEY}
      />

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
