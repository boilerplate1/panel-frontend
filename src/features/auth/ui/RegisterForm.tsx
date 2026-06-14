import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button, FormField, FormError } from '@/shared/ui';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../model/useAuth';
import { useUIStore, getApiErrorMessage } from '@/shared/lib';
import { authApi } from '@/shared/api';
import { APP_CONFIG, ROUTES } from '@/shared/config';
import styles from './AuthForm.module.css';

export function RegisterForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useUIStore();
  const registrationEnabled = true;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formDataState, setFormDataState] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError(t('auth.password_mismatch'));
      return;
    }

    if (!captchaToken) {
      setError(null);
      setFormDataState({ username, password, confirmPassword });
      setShowCaptcha(true);
      return;
    }

    await performRegister(username, password, confirmPassword, captchaToken);
  };

  const performRegister = async (username: string, password: string, confirmPassword: string, token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.register({ 
        username, 
        password, 
        confirmPassword, 
        captchaToken: token 
      });
      login(data.accessToken, data.user);
      showToast(t('auth.register_success'), 'success');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const msg = getApiErrorMessage(err, t('auth.register_error'), t);
      setError(msg);
      // Reset captcha on error
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!registrationEnabled) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('auth.register')}</h1>
          <p className={styles.subtitle}>{t('auth.register_hint')}</p>
        </div>
        <div className={styles.disabledState}>
          <p className={styles.disabledTitle}>{t('auth.register_error')}</p>
          <p className={styles.disabledText}>{t('auth.register_hint')}</p>
          <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className={styles.backBtn}>
            {t('auth.login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('auth.register')}</h1>
        <p className={styles.subtitle}>{t('auth.register_hint')}</p>
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
          defaultValue={formDataState?.username}
        />
        <FormField
          name="password"
          type="password"
          label={t('auth.password')}
          placeholder={t('auth.password_placeholder')}
          required
          autoComplete="new-password"
          showPasswordToggle
          disabled={isLoading}
          defaultValue={formDataState?.password}
        />
        <FormField
          name="confirmPassword"
          type="password"
          label={t('auth.confirm_password')}
          placeholder={t('auth.password_placeholder')}
          required
          autoComplete="new-password"
          showPasswordToggle
          disabled={isLoading}
          defaultValue={formDataState?.confirmPassword}
        />

        {showCaptcha && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
            <Turnstile
              siteKey={APP_CONFIG.RECAPTCHA_SITE_KEY}
              onSuccess={(token) => {
                setCaptchaToken(token);
                if (formDataState) {
                  performRegister(formDataState.username, formDataState.password, formDataState.confirmPassword, token);
                }
              }}
              options={{
                action: 'register',
                theme: 'dark',
              }}
            />
          </div>
        )}

        <Button type="submit" className={styles.submitBtn} disabled={isLoading || (showCaptcha && !captchaToken)}>
          {isLoading ? (
            <Loader2 className={styles.spinner} size={22} />
          ) : (
            t('auth.register_btn')
          )}
        </Button>
      </form>

      <div className={styles.footer}>
        <p>
          {t('auth.have_account')}
          <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className={styles.link}>
            {t('auth.login')}
          </button>
        </p>
      </div>
    </div>
  );
}
