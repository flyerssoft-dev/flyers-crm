let initialState = {
	contact: [],
	contactData: {}
};

const contactReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'GET_CONTACT':
			return {
				...state,
				contact: action.payload,
			};

		case 'GET_CONTACT_BY_ID':
			return {
				...state,
				contactData: action.payload,
			};
		default:
			return state;
	}
};

export { contactReducer };
