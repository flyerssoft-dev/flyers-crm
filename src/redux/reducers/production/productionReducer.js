let initialState = {
	production: [],
};

const productionReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'GET_PRODUCTION_LIST':
			return {
				...state,
				production: action.payload,
			};
		default:
			return state;
	}
};

export { productionReducer };
