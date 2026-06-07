import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useLogoutMutation, useAuth } from '@/features/auth';
import { Dropdown, type DropdownItem } from '@/shared/ui';
import styles from './DesktopHeader.module.css';

interface UserDropdownProps {
  username: string;
}

export function UserDropdown({ username }: UserDropdownProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Ignore
    } finally {
      logout();
      navigate('/login');
    }
  };

  const items: DropdownItem[] = [
    {
      label: t('navbar.profile'),
      icon: <UserIcon size={22} />,
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      label: logoutMutation.isPending ? t('shared.loading') : t('navbar.logout'),
      icon: <LogOut size={22} />,
      onClick: handleLogout,
      variant: 'danger',
    },
  ];

  const trigger = (
    <div className={styles.userTrigger}>
      <span className={styles.userAvatar}>
        {username.charAt(0).toUpperCase()}
      </span>
      <span className={styles.userName}>
        {username}
      </span>
    </div>
  );

  return <Dropdown trigger={trigger} items={items} />;
}
