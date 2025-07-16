import { useRoutes } from 'react-router-dom';
import ProtectedRoutes from './protected';
import { publicRoutes } from './public';
import useAuthStore from './../feature/auth/store/useAuthStore';

export const AppRoutes = () => {
  const { getAccessToken, getUserRole, getUserData, getUserPermissions } = useAuthStore();

  const isAuthenticated = getAccessToken() && getUserData() && getUserRole() ? true : false;
  const routes = isAuthenticated
    ? ProtectedRoutes(isAuthenticated, getUserPermissions())
    : publicRoutes;

  const element = useRoutes([...routes]);
  return <>{element}</>;
};
