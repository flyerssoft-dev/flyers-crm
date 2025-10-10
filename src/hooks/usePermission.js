import { useSelector } from "react-redux";

export function CheckPermission(feature, action) {
   const User = useSelector((state) => state.loginRedux);
  const permissions =User.user_role_permissions?.permissions;
  if (!permissions) return false;
  const matchedFeature = permissions.find(
    (p) => p.feature.toLowerCase() === feature.toLowerCase()
  );

  if (!matchedFeature) return false;

  return matchedFeature.actions.some(
    (a) => a.toLowerCase() === action.toLowerCase()
  );
}
