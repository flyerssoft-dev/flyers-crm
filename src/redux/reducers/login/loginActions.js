function setLoginStatus(data) {
	return {
		type: 'SET_LOGIN_STATUS',
		payload: data,
	};
}

function setProfileUpdatedStatus(data) {
	return {
		type: 'SET_PROFILE_UPDATED_STATUS',
		payload: data,
	};
}

function setLoginSuccess(data) {
	return {
		type: 'SET_LOGIN_SUCCESS',
		payload: data,
	};
}

function setUserDetails(data) {
	return {
		type: 'SET_USER_DETAILS',
		payload: data,
	};
}

function setForgotPasswordData(data) {
	return {
		type: 'SET_FORGOT_PASSWORD_DATA',
		payload: data,
	};
}

function resetForgotPasswordData() {
	return {
		type: 'SET_FORGOT_PASSWORD_DATA',
		payload: {},
	};
}

function logoutAction(data) {
	return {
		type: 'LOGOUT',
		payload: data,
	};
}

export { setLoginStatus, setProfileUpdatedStatus, setUserDetails, setForgotPasswordData, resetForgotPasswordData, logoutAction, setLoginSuccess };
