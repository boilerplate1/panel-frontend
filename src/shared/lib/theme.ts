export type Theme = 'light' | 'dark';

const THEME_ATTR = 'data-theme';
const THEME_EVENT = 'themechange';

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getCurrentTheme(): Theme {
  const value = document.documentElement.getAttribute(THEME_ATTR);
  return value === 'light' || value === 'dark' ? value : getSystemTheme();
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute(THEME_ATTR, theme);
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme } }));
}

export function initSystemTheme() {
  if (typeof window === 'undefined') return () => {};

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const applySystemTheme = () => applyTheme(media.matches ? 'dark' : 'light');

  applySystemTheme();
  media.addEventListener('change', applySystemTheme);

  return () => {
    media.removeEventListener('change', applySystemTheme);
  };
}

export function subscribeTheme(listener: (theme: Theme) => void) {
  const handler = (event: Event) => {
    listener((event as CustomEvent<{ theme: Theme }>).detail.theme);
  };

  window.addEventListener(THEME_EVENT, handler);
  return () => window.removeEventListener(THEME_EVENT, handler);
}
