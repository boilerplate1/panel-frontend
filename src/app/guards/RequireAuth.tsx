import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Loader } from '@/shared/ui';

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
