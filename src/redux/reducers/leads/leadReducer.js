let initialState = {
	leads: [],
};

const leadsReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_LEADS':
			return {
				...state,
				leads: action.payload,
			};
		default:
			return state;
	}
};

export { leadsReducer };
