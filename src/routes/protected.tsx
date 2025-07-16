import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFound } from './../feature/auth/pages';

import MainLayout from './../components/layouts';

import { appRoutes } from './../routes/appRoutes';
import { Actions, Features } from '@/enum';

export const NotFoudedRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/**
 * Generates protected routes based on user authentication and permissions.
 * @param {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @param {any} userPermissions - User's permissions to access certain routes and actions.
 * @returns {any} Array of protected routes or null.
 */

const ProtectedRoutes = (isAuthenticated: boolean, userPermissions: any) => {
  /**
   * Filters routes based on user permissions.
   * @param {any[]} routes - The list of all available routes.
   * @param {any} permissions - The user's permissions.
   * @returns {any[]} Filtered routes that the user has access to.
   */
  const filterRoutesByPermissions = (routes: any, permissions: any) => {
    const userHasPermission = (feature: Features, action: Actions) => {
      const featurePermissions =
        permissions && permissions?.find((p: any) => p.feature === feature);

      return featurePermissions?.actions.includes(action);
    };

    /**
     * Recursively filters routes based on user permissions.
     * @param {any[]} routes - The list of routes to filter.
     * @returns {any[]} Filtered routes that the user has access to.
     */
    const filter = (routes: any) =>
      routes
        .map((route: any) => {
          if (route?.children) {
            const filteredChildren = filter(route.children);
            if (filteredChildren.length) {
              const childRoutes = filteredChildren.map((item: any) => {
                return {
                  ...item,
                  path: `${route.path}${item.path}`,
                };
              });
              return { ...route, children: childRoutes };
            }
            return null; // Exclude route if no accessible children exist
          } else if (
            !route.credential ||
            userHasPermission(route.credential.feature, route.credential.action)
          ) {
            return route; // Include route if no credential is required or if the user has permission
          }
          return null; // Exclude route
        })
        .filter(Boolean);

    return filter(routes);
  };

  const filteredRoutes = filterRoutesByPermissions(appRoutes, userPermissions);

  /**
   * Recursively renders routes as React components.
   * @param {any[]} routes - The list of routes to render.
   * @returns {JSX.Element[]} Rendered React route components.
   */
  const renderRoutes = (routes: any) => {
    return routes.map((route: any) => {
      if (route.children) {
        return (
          <Route key={route.path} path={route.path}>
            {renderRoutes(route.children)}
          </Route>
        );
      }
      return <Route key={route.path} path={route.path} element={<>{route.element}</>}></Route>;
    });
  };

  const mainRoutes = <Routes> {renderRoutes(filteredRoutes)}</Routes>;

  const protectedRoutes = isAuthenticated
    ? [
        {
          path: '/',
          element: <MainLayout />,
          children: [
            { path: `/*`, element: mainRoutes },
            {
              path: '/',
              element: <Navigate to={`/dashboard`} />,
            },
          ],
        },
        { path: '*', element: <Navigate to={`/dashboard`} /> },
      ]
    : [{ path: '*', element: <NotFoudedRoutes /> }];

  return protectedRoutes || null; // Return null or a fallback if isAuthenticated is false
};

export default ProtectedRoutes;
