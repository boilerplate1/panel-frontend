import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/shared/lib';

export const useSecureClipboard = () => {
  const { t } = useTranslation();
  const { showToast } = useUIStore();

  const copy = async (data: string, label: string) => {
    if (!data) return false;

    try {
      await navigator.clipboard.writeText(data);

      console.info(`[Security Audit]: Sensitive information (${label}) copied to clipboard`);

      showToast(t('auth.copied'), 'success');
      return true;
    } catch (err) {
      console.error(`[Security Audit]: Failed to copy ${label}`, err);
      showToast(t('errors.system_error_title'), 'error');
      return false;
    }
  };

  return { copy };
};
