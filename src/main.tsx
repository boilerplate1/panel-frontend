import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initSystemTheme } from './shared/lib/theme';
import './shared/lib/i18n';
import './index.css';
import App from './app/App.tsx';

initSystemTheme();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ignore PWA registration failures.
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
