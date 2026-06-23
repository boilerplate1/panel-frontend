import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';

type SeoEntry = {
  title: string;
  description: string;
};

const seoByPath: Record<string, (t: (key: string) => string) => SeoEntry> = {
  [ROUTES.LOGIN]: (t) => ({
    title: t('seo.login_title'),
    description: t('seo.login_description'),
  }),
  [ROUTES.REGISTER]: (t) => ({
    title: t('seo.register_title'),
    description: t('seo.register_description'),
  }),
  [ROUTES.DASHBOARD]: (t) => ({
    title: t('seo.profile_title'),
    description: t('seo.profile_description'),
  }),
  [ROUTES.DEVICES]: (t) => ({
    title: t('seo.devices_title'),
    description: t('seo.devices_description'),
  }),
  [ROUTES.HISTORY]: (t) => ({
    title: t('seo.history_title'),
    description: t('seo.history_description'),
  }),
  [ROUTES.CHECKOUT]: (t) => ({
    title: t('seo.subscription_title'),
    description: t('seo.subscription_description'),
  }),
  [ROUTES.HOME]: (t) => ({
    title: t('seo.home_title'),
    description: t('seo.home_description'),
  }),
};

function updateMeta(attribute: 'name' | 'property', key: string, value: string) {
  const selector = `meta[${attribute}="${key}"]`;
  const element = document.head.querySelector<HTMLMetaElement>(selector);

  if (element) {
    element.content = value;
    return;
  }

  const created = document.createElement('meta');
  created.setAttribute(attribute, key);
  created.content = value;
  document.head.appendChild(created);
}

export function Seo() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith('ru') ? 'ru' : 'en';

    const currentPath = location.pathname.replace(/\/+$/, '') || '/';

    const entryFactory = seoByPath[currentPath] || seoByPath[ROUTES.HOME];
    const entry = entryFactory(t);

    document.title = entry.title;
    updateMeta('name', 'description', entry.description);
    updateMeta('property', 'og:title', entry.title);
    updateMeta('property', 'og:description', entry.description);
    updateMeta('name', 'twitter:title', entry.title);
    updateMeta('name', 'twitter:description', entry.description);
  }, [i18n.language, location.pathname, t]);

  return null;
}
