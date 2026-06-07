import { useAuthStore } from './authStore';

export const useAuth = () => {
  const { user, accessToken, isAuthenticated, isLoading, actions } = useAuthStore();

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login: actions.login,
    logout: actions.logout,
  };
};
