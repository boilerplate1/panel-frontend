import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, FormField, FormError } from '@/shared/ui';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../model/useAuth';
import { useUIStore, getApiErrorMessage } from '@/shared/lib';
import { authApi } from '@/shared/api';
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    setError(null);
    setIsLoading(true);

    try {
      const data = await authApi.loginWeb({ username, password });
      authLogin(data.accessToken, data.user);
      showToast(t('auth.login_success'), 'success');
      navigate('/my');
    } catch (err) {
      const msg = getApiErrorMessage(err, t('auth.login_error'), t);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('auth.login')}</h1>
        <p className={styles.subtitle}>{t('auth.login_hint')}</p>
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
          autoComplete="current-password"
        />

        <Button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? (
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
        <p>
          {t('auth.no_account')}{' '}
          {registrationEnabled && (
            <Link to="/register" className={styles.link}>
              {t('auth.create_account')}
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
