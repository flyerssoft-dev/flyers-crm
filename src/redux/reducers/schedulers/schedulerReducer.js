let initialState = {
	schedulers: [],
};

const schedulerReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_SCHEDULERS':
			return {
				...state,
				schedulers: action.payload,
			};

		default:
			return state;
	}
};

export { schedulerReducer };
