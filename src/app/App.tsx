import { RouterProvider } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AppProviders } from '@/app/providers/AppProviders';
import { router } from '@/app/router';

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <SpeedInsights />
    </AppProviders>
  );
}
