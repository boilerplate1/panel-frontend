import { useEffect, type ReactNode } from 'react';
import { useAuthStore, useAuthActions } from './authStore';
import { useAuthMeQuery } from '@/entities/user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { setUser, setLoading, logout } = useAuthActions();

  const meQuery = useAuthMeQuery(!!accessToken);

  useEffect(() => {
    setLoading(meQuery.isLoading);
  }, [meQuery.isLoading, setLoading]);

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.data, setUser]);

  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, [logout]);

  return <>{children}</>;
};
