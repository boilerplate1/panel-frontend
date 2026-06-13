import { RouterProvider } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { AppProviders } from '@/app/providers/AppProviders';
import { router } from '@/app/router';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default Sentry.withErrorBoundary(App, {
  fallback: <div style={{ padding: '20px', textAlign: 'center' }}>Oops! Something went wrong. Please refresh the page.</div>,
  showDialog: true,
});
