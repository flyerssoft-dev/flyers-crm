let initialState = {
	dashboard: [],
};

const dashboardReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'GET_DASHBOARD_DATA':
			return {
				...state,
				dashboard: action.payload,
			};
		default:
			return state;
	}
};

export { dashboardReducer };
