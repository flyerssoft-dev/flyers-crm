let initialState = {
	contact: [],
};

const contactReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'GET_CONTACT':
			return {
				...state,
				contact: action.payload,
			};
		default:
			return state;
	}
};

export { contactReducer };
