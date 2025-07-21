import React, { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
	const User = useSelector((state) => state.loginRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	if (!User.isLogged) {
		return <Navigate to={'/login'} replace />;
	}
	if (!globalRedux?.selectedOrganization?.id) {
		return <Navigate to={'/organization'} replace />;
	}
	// if (!User.isProfileUpdated) {
	// 	return <Navigate to={'/complete-your-profile'} replace />;
	// }
	return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
