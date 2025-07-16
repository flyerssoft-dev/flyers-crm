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

const registerReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_REGISTER_STATUS':
			return {
				...state,
				isLogged: action.payload,
			};

		case 'SET_REGISTER_SUCCESS':
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

export { registerReducer };
