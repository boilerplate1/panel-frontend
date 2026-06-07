import { useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, FormField, FormError } from '@/shared/ui';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../model/useAuth';
import { useUIStore, getApiErrorMessage } from '@/shared/lib';
import { authApi } from '@/shared/api';
import { useClientSettingsQuery } from '@/shared/api';
import styles from './AuthForm.module.css';

export function LoginForm() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useUIStore();
  const { data: clientSettings } = useClientSettingsQuery();
  const registrationEnabled = clientSettings?.flags?.allowRegistration ?? true;

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    setError(null);
    startTransition(async () => {
      try {
        const data = await authApi.loginWeb({ username, password });
        authLogin(data.accessToken, data.user);
        showToast(t('auth.login_success'), 'success');
        navigate('/dashboard/profile');
      } catch (err) {
        const msg = getApiErrorMessage(err, t('auth.login_error'), t);
        setError(msg);
      }
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('auth.login')}</h1>
        <p className={styles.subtitle}>{t('auth.login_hint')}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormField
          name="username"
          label={t('auth.username')}
          placeholder={t('auth.username')}
          required
          autoComplete="username"
        />
        <FormField
          name="password"
          type="password"
          label={t('auth.password')}
          placeholder={t('auth.password')}
          required
          autoComplete="current-password"
        />

        {error && <FormError message={error} />}

        <Button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? (
            <Loader2 className={styles.spinner} size={22} />
          ) : (
            <>
              <span>{t('auth.login')}</span>
              <ArrowRight size={22} />
            </>
          )}
        </Button>
      </form>

      <div className={styles.footer}>
        {registrationEnabled ? (
          <p>
            {t('auth.no_account')}
            <button type="button" onClick={() => navigate('/register')} className={styles.link}>
              {t('auth.create_account')}
            </button>
          </p>
        ) : (
          <p>{t('auth.no_account')}</p>
        )}
      </div>
    </div>
  );
}
