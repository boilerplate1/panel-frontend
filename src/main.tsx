import { createRoot } from 'react-dom/client';
import { initSystemTheme } from './shared/lib/theme';
import './shared/lib/i18n';
import './index.css';
import App from './app/App.tsx';

initSystemTheme();

createRoot(document.getElementById('root')!).render(<App />);
