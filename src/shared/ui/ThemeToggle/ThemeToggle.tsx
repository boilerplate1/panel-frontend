import { useTranslation } from 'react-i18next';
import { Sun, Moon, Check, type LucideIcon } from 'lucide-react';
import styles from './ThemeToggle.module.css';
import { applyTheme, getCurrentTheme, subscribeTheme, type Theme } from '@/shared/lib';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  variant?: 'default' | 'settings';
  label?: string;
  className?: string;
}

export function ThemeToggle({ variant = 'default', label, className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(getCurrentTheme());
  const { t } = useTranslation();

  useEffect(() => {
    return subscribeTheme(setTheme);
  }, []);

  const setThemeHandler = (newTheme: Theme) => {
    applyTheme(newTheme);
  };

  if (variant === 'settings') {
    const options: { id: Theme; label: string; icon: LucideIcon }[] = [
      { id: 'light', label: t('shared.light'), icon: Moon },
      { id: 'dark', label: t('shared.dark'), icon: Sun },
    ];

    return (
      <div className={styles.settingsList}>
        {options.map((opt) => (
          <button
            key={opt.id}
            className={`${styles.themeOption} ${theme === opt.id ? styles.activeOption : ''}`}
            onClick={() => setThemeHandler(opt.id)}
            type="button"
          >
            <div className={styles.optionInfo}>
              <opt.icon size={22} className={styles.optionIcon} />
              <span className={styles.optionLabel}>{opt.label}</span>
            </div>
            {theme === opt.id && <Check size={22} className={styles.checkIcon} />}
          </button>
        ))}
      </div>
    );
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  };

  return (
    <button
      className={`${label ? styles.rootLabel : styles.root} ${className}`}
      onClick={toggleTheme}
      aria-label={t('shared.theme_toggle')}
      type="button"
    >
      {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
      {label && <span>{label}</span>}
    </button>
  );
}
