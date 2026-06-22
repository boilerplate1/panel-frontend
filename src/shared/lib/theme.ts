export type Theme = 'light' | 'dark';

const THEME_ATTR = 'data-theme';
const THEME_EVENT = 'themechange';
const STORAGE_KEY = 'hypex-theme';

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getCurrentTheme(): Theme {
  const value = document.documentElement.getAttribute(THEME_ATTR);
  return value === 'light' || value === 'dark' ? value : 'dark';
}

const THEME_COLORS: Record<Theme, string> = {
  dark: '#0f0f0f',
  light: '#f5f5f7',
};

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute(THEME_ATTR, theme);
  document.documentElement.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[theme]);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme } }));
}

export function initSystemTheme() {
  if (typeof window === 'undefined') return () => {};

  let theme: Theme = 'dark';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      theme = saved;
    }
  } catch {}

  applyTheme(theme);
}

export function subscribeTheme(listener: (theme: Theme) => void) {
  const handler = (event: Event) => {
    listener((event as CustomEvent<{ theme: Theme }>).detail.theme);
  };

  window.addEventListener(THEME_EVENT, handler);
  return () => window.removeEventListener(THEME_EVENT, handler);
}
