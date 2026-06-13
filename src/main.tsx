import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from "@sentry/react";
import { 
  createRoutesFromElements, 
  matchRoutes, 
  useLocation, 
  useNavigationType 
} from "react-router-dom";
import { initSystemTheme } from './shared/lib/theme';
import './shared/lib/i18n';
import './index.css';
import App from './app/App.tsx';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "https://10ed02c942668f0b0ab04ffb470e82e9@o4511559027982336.ingest.us.sentry.io/4511559029030912",
  integrations: [
    Sentry.browserTracingIntegration({
      // Pass the router details to Sentry for tracing
      routerIntersection: {
        createRoutesFromElements,
        matchRoutes,
        useLocation,
        useNavigationType,
      },
    }),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, 
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

initSystemTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
