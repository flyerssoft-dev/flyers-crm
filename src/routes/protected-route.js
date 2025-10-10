import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoAccess from "components/no-access";

const ProtectedRoute = ({ children, credential }) => {
  const User = useSelector((state) => state.loginRedux);
  const globalRedux = useSelector((state) => state.globalRedux);


  function isAllowed(request, permissions) {

    const feature = request?.feature?.toLowerCase();

    const matchedFeature = permissions?.find(
      (p) => p?.feature?.toLowerCase() === feature
    );

    if (!matchedFeature) return false;

    return matchedFeature?.actions?.some(
      (action) => action?.toLowerCase() === request?.action?.toLowerCase()
    );
  }

  if (!User.isLogged) {
    return <Navigate to={"/login"} replace />;
  }
  if (!globalRedux?.selectedOrganization?.id) {
    return <Navigate to={"/organization"} replace />;
  }
  // if (!User.isProfileUpdated) {
  // 	return <Navigate to={'/complete-your-profile'} replace />;
  // }

  if (credential && isAllowed(credential, User?.user_role_permissions?.permissions) === false) {
    return <NoAccess />; // or redirect to "/"
  }
  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
