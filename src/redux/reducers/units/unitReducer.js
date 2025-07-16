let initialState = {
	units: [],
};

const unitReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_UNITS':
			return {
				...state,
				units: action.payload,
			};

		default:
			return state;
	}
};

export { unitReducer };
