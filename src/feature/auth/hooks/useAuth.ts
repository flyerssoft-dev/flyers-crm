import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useMenuStore from '@store/useMenuStore';
import { useMutation } from '@tanstack/react-query';
import {
  LoginCredentails,
  loginWithCredentials,
  loginWithSSO as ssoLogin,
} from '@feature/auth/api/postApi';
import { AxiosError } from 'axios';
import { getEmployeeDetails } from '@/feature/employee/services';

const useAuth = () => {
  const {
    setAccessToken,
    setRefreshToken,
    setUserData,
    getUserData,
    getAccessToken,
    setUserRole,
    setUserPermissions,
    clearTokens,
    setLoggedWithSSO,
  } = useAuthStore();
  const { reset: menuReset } = useMenuStore();

  const navigate = useNavigate();

  const REDIRECT_AFTER_LOGIN = '/overview';

  const loginWithSSO = useMutation({
    mutationFn: async (code: string | null) => ssoLogin(code),
    onSuccess: async (response) => {
      setLoggedWithSSO(true);
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      console.log('getAccessToken', getAccessToken());
      if (getAccessToken()) {
        const { data } = (await getEmployeeDetails()) || {};
        setUserData(data);
        setUserRole(data?.Role);
        const permissions = data?.user_role_permissions?.permissions;
        if (permissions) {
          setUserPermissions(permissions);
        }
      }
      if (getUserData()) {
        navigate(REDIRECT_AFTER_LOGIN);
      }
    },
    onError: (error: AxiosError) => {
      // if we get 403 forbidden then we have to force logout after sso login initiated
      const errorResponseStatus = error?.response?.status;
      if (errorResponseStatus === 403) {
        setTimeout(() => {
          window.location.href = `https://login.microsoftonline.com/${
            import.meta.env.VITE_AZURE_AD_TENANTID
          }/oauth2/v2.0/logout?post_logout_redirect_uri=${
            import.meta.env.VITE_REDIRECT_URL
          }/auth/login`;
        }, 2000);
      }
      console.error('SSO Login failed:', error);
    },
  });
  const login = useMutation({
    mutationFn: async (data: LoginCredentails) => loginWithCredentials(data),
    onSuccess: async (response) => {
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      if (getAccessToken()) {
        const { data } = (await getEmployeeDetails()) || {};
        setUserData(data);
        setUserRole(data?.Role);
        const permissions = data?.user_role_permissions?.permissions;
        if (permissions) {
          setUserPermissions(permissions);
        }
      }
      if (getUserData()) {
        navigate(REDIRECT_AFTER_LOGIN);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
  const logout = () => {
    clearTokens();
    menuReset();
    navigate('/auth/login');
  };

  return { loginWithSSO, login, logout };
};

export default useAuth;
