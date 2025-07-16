let initialState = {
	serviceTrips: [],
};

const serviceTripsReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_SERVICE_TRIPS':
			return {
				...state,
				serviceTrips: action.payload,
			};

		default:
			return state;
	}
};

export { serviceTripsReducer };
