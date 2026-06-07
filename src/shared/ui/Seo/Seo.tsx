import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type SeoEntry = {
  title: string;
  description: string;
};

const seoByPath: Record<string, (t: (key: string) => string) => SeoEntry> = {
  '/': (t) => ({
    title: t('seo.home_title'),
    description: t('seo.home_description'),
  }),
  '/gift': (t) => ({
    title: t('seo.gift_title'),
    description: t('seo.gift_description'),
  }),
  '/login': (t) => ({
    title: t('seo.login_title'),
    description: t('seo.login_description'),
  }),
  '/register': (t) => ({
    title: t('seo.register_title'),
    description: t('seo.register_description'),
  }),
  '/download': (t) => ({
    title: t('download.seo_title'),
    description: t('download.seo_description'),
  }),
  '/dashboard/profile': (t) => ({
    title: t('seo.profile_title'),
    description: t('seo.profile_description'),
  }),
  '/dashboard/devices': (t) => ({
    title: t('seo.devices_title'),
    description: t('seo.devices_description'),
  }),
  '/dashboard/balance/history': (t) => ({
    title: t('seo.history_title'),
    description: t('seo.history_description'),
  }),
  '/dashboard/subscription/buy': (t) => ({
    title: t('seo.subscription_title'),
    description: t('seo.subscription_description'),
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

    const path = location.pathname.replace(/\/+$/, '') || '/';
    const entryFactory = seoByPath[path] ?? seoByPath['/'];
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
