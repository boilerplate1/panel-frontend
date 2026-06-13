import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, FormField, FormError, CaptchaModal } from '@/shared/ui';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../model/useAuth';
import { useUIStore, getApiErrorMessage } from '@/shared/lib';
import { authApi } from '@/shared/api';
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
  const [pendingData, setPendingData] = useState<any>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError(t('auth.password_mismatch'));
      return;
    }

    setError(null);
    setPendingData({ username, password, confirmPassword });
    setShowCaptcha(true);
  };

  const handleCaptchaVerify = async (token: string) => {
    setShowCaptcha(false);
    if (!pendingData) return;

    setIsLoading(true);
    try {
      const data = await authApi.register({ 
        ...pendingData, 
        captchaToken: token 
      });
      login(data.accessToken, data.user);
      showToast(t('auth.register_success'), 'success');
      navigate('/my');
    } catch (err) {
      const msg = getApiErrorMessage(err, t('auth.register_error'), t);
      setError(msg);
    } finally {
      setIsLoading(false);
      setPendingData(null);
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
          <button type="button" onClick={() => navigate('/login')} className={styles.backBtn}>
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

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormField
          name="username"
          label={t('auth.username')}
          placeholder="shadowmind"
          required
          autoComplete="username"
        />
        <FormField
          name="password"
          type="password"
          label={t('auth.password')}
          placeholder={t('auth.password_placeholder')}
          required
          autoComplete="new-password"
        />
        <FormField
          name="confirmPassword"
          type="password"
          label={t('auth.confirm_password')}
          placeholder={t('auth.password_placeholder')}
          required
          autoComplete="new-password"
        />

        <Button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className={styles.spinner} size={22} />
          ) : (
            <>
              <span>{t('auth.register_btn')}</span>
              <ArrowRight size={22} />
            </>
          )}
        </Button>
      </form>

      <CaptchaModal
        isOpen={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        onVerify={handleCaptchaVerify}
        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
      />

      <div className={styles.footer}>
        <p>
          {t('auth.have_account')}
          <button type="button" onClick={() => navigate('/login')} className={styles.link}>
            {t('auth.login')}
          </button>
        </p>
      </div>
    </div>
  );
}
