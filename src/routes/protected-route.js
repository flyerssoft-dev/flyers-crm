import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoAccess from "components/no-access";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const User = useSelector((state) => state.loginRedux);
  const globalRedux = useSelector((state) => state.globalRedux);
  if (!User.isLogged) {
    return <Navigate to={"/login"} replace />;
  }
  if (!globalRedux?.selectedOrganization?.id) {
    return <Navigate to={"/organization"} replace />;
  }
  // if (!User.isProfileUpdated) {
  // 	return <Navigate to={'/complete-your-profile'} replace />;
  // }

  if (allowedRoles && !allowedRoles.includes(User.role)) {
    return <NoAccess />; // or redirect to "/"
  }
  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
