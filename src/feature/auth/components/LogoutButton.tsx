import { RightIcon } from '@assets/icons';
import FsButton from '@components/Button';
import useAuth from '../hooks/useAuth';
import useAuthStore from '../store/useAuthStore';

const SSO_logoutUrl = () => {
  const tenantId = import.meta.env.VITE_AZURE_AD_TENANTID;
  const redirectUri = `${import.meta.env.VITE_REDIRECT_URL}/auth/login`;

  return `${
    import.meta.env.VITE_AZURE_BASE_URL
  }/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${redirectUri}`;
};

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const { isLoggedWithSSO } = useAuthStore();
  return (
    <FsButton
      type="default"
      isIcon={true}
      icon={<RightIcon fill="primary" className="w-5 h-5" />}
      iconPosition="end"
      onClick={logout}
      text="Log out"
      textClassName="font-medium text-sm leading-5 text-[primary]"
      href={isLoggedWithSSO ? SSO_logoutUrl() : undefined}
      className="rounded"
    />
  );
};

export default LogoutButton;
