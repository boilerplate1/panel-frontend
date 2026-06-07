import { useTranslation } from 'react-i18next';
import { Dropdown, type DropdownItem } from '@/shared/ui';
import { RU_FLAG, EN_FLAG } from '@/shared/assets/icons/flags';
import styles from './LangSwitcher.module.css';
import { Check } from 'lucide-react';

interface LangSwitcherProps {
  variant?: 'default' | 'settings';
}

export function LangSwitcher({ variant = 'default' }: LangSwitcherProps) {
  const { i18n, t } = useTranslation();

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  if (variant === 'settings') {
    const options = [
      { id: 'ru', label: t('shared.russian'), flag: RU_FLAG },
      { id: 'en', label: t('shared.english'), flag: EN_FLAG },
    ];

    return (
      <div className={styles.settingsList}>
        {options.map((opt) => (
          <button
            key={opt.id}
            className={`${styles.langOption} ${i18n.language === opt.id ? styles.activeOption : ''}`}
            onClick={() => toggleLanguage(opt.id)}
            type="button"
          >
            <div className={styles.optionInfo}>
              <img src={opt.flag} alt={opt.id} className={styles.optionFlag} />
              <span className={styles.optionLabel}>{opt.label}</span>
            </div>
            {i18n.language === opt.id && <Check size={22} className={styles.checkIcon} />}
          </button>
        ))}
      </div>
    );
  }

  const items: DropdownItem[] = [
    {
      label: t('shared.russian'),
      icon: <img src={RU_FLAG} alt={t('shared.russian')} className={styles.flagIcon} />,
      onClick: () => toggleLanguage('ru'),
    },
    {
      label: t('shared.english'),
      icon: <img src={EN_FLAG} alt={t('shared.english')} className={styles.flagIcon} />,
      onClick: () => toggleLanguage('en'),
    },
  ];

  const currentFlag = i18n.language === 'ru' ? RU_FLAG : EN_FLAG;

  const trigger = (
    <div className={styles.trigger}>
      <img
        src={currentFlag}
        alt={i18n.language === 'ru' ? t('shared.russian') : t('shared.english')}
        className={styles.flagIcon}
      />
      <span className={styles.langText}>{i18n.language.toUpperCase()}</span>
    </div>
  );

  return <Dropdown trigger={trigger} items={items} />;
}
