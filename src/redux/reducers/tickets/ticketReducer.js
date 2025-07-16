let initialState = {
	tickets: [],
	ticketDetails: {}
};

const ticketReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'GET_TICKETS':
			return {
				...state,
				tickets: action.payload,
			};
		case 'GET_TICKETS_DETAILS':
			return {
				...state,
				ticketDetails: action.payload,
			};
		default:
			return state;
	}
};

export { ticketReducer };
