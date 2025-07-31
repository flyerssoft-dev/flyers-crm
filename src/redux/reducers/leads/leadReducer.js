let initialState = {
	leads: [],
	leadData: {}
};

const leadsReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_LEADS':
			return {
				...state,
				leads: action.payload,
			};
		case 'GET_LEADS_BY_ID':
			return {
				...state,
				leadData: action.payload,
			};
		default:
			return state;
	}
};

export { leadsReducer };
