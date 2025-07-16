let initialState = {
	students: [],
};

const StudentsReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'SET_STUDENTS':
			return {
				...state,
				students: action.payload,
			};

		default:
			return state;
	}
};

export { StudentsReducer };
