let initialState = {
	deals: [],
};

const dealReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'GET_DEALS':
			return {
				...state,
				deals: action.payload,
			};
		default:
			return state;
	}
};

export { dealReducer };
