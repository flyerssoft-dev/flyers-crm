let initialState = {
	isLogged: false,
	firstName: '',
	lastName: '',
	email: '',
	role: '',
	token: '',
	mobile: '',
	id: '',
	forgotPasswordData: {},
};

const loginReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_LOGIN_STATUS':
			return {
				...state,
				isLogged: action.payload,
			};

		case 'SET_PROFILE_UPDATED_STATUS':
			return {
				...state,
				isProfileUpdated: true,
				...(action.payload || {}),
			};

		case 'SET_LOGIN_SUCCESS':
			return {
				...state,
				...action.payload,
				isLogged: true,
			};

		case 'SET_FORGOT_PASSWORD_DATA':
			return {
				...state,
				forgotPasswordData: action.payload,
			};

		case 'LOGOUT':
			return initialState;

		default:
			return state;
	}
};

export { loginReducer };
