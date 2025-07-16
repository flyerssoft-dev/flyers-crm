import { ChildItem, MenuProps } from '../../../types/menuTypes';

export const userPermissions = (permissionsList: any, data: MenuProps | ChildItem) => {
  const checkPermission = (item: any) => {
    let hasPermission;

    if (item?.children) {
      hasPermission = item.children.some((child: any) => {
        const requiredFeature =
          permissionsList &&
          permissionsList?.find((f: { feature: any }) => f.feature === child?.credential.feature);
        const requiredActions =
          requiredFeature && requiredFeature?.actions.includes(child?.credential.action);
        return requiredActions;
      });
    } else {
      if (item.credential) {
        const requiredPermission =
          permissionsList &&
          permissionsList?.find((f: { feature: any }) => f.feature === item?.credential.feature);
        hasPermission =
          requiredPermission && requiredPermission?.actions.includes(item?.credential.action);
      } else {
        hasPermission = true;
      }
    }

    return hasPermission;
  };
  return checkPermission(data);
};
