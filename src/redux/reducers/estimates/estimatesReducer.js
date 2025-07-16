let initialState = {
	estimates: [],
};

const EstimatesReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_ESTIMATES':
			return {
				...state,
				estimates: action.payload,
			};
		default:
			return state;
	}
};

export { EstimatesReducer };
