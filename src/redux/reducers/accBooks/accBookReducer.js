let initialState = {
	accBooks: [],
	selectedStaffs: null,
};

const AccBooksReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'SET_ACC_BOOKS':
			return {
				...state,
				accBooks: action.payload,
			};

		case 'SET_SELECTED_STAFFS':
			return {
				...state,
				selectedStaffs: action.payload,
			};

		default:
			return state;
	}
};

export { AccBooksReducer };
