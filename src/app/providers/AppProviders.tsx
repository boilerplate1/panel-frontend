import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/features/auth';
import { queryClient } from '@/shared/lib';
import { BackendAvailabilityGate } from '@/app/ui/BackendAvailabilityGate';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const showDevtools = import.meta.env.DEV;

  return (
    <QueryClientProvider client={queryClient}>
      <BackendAvailabilityGate>
        <AuthProvider>{children}</AuthProvider>
      </BackendAvailabilityGate>
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
