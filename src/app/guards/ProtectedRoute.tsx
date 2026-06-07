import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Loader } from '@/shared/ui';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
