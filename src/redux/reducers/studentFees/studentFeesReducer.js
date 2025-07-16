let initialState = {
	studentsFees: [],
};

const StudentsFeesReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'SET_STUDENTS_FEES':
			return {
				...state,
				studentsFees: action.payload,
			};

		default:
			return state;
	}
};

export { StudentsFeesReducer };
