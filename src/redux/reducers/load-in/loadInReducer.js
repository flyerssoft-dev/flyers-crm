let initialState = {
	loadIn: [],
};

const LoadInReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}
		case 'SET_LOAD_IN':
			return {
				...state,
				loadIn: action.payload,
			};
		default:
			return state;
	}
};

export { LoadInReducer };
