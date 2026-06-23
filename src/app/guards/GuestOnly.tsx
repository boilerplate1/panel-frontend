import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from '@/shared/ui';
import { useAuth } from '@/stores/authStore';

interface GuestOnlyProps {
  children: ReactNode;
}

export function GuestOnly({ children }: GuestOnlyProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader fullPage />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
