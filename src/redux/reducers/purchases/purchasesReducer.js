let initialState = {
	purchases: [],
};

const purchasesReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'SET_PURCHASES':
			return {
				...state,
				purchases: action.payload,
			};
		default:
			return state;
	}
};

export { purchasesReducer };
