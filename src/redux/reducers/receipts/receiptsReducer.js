let initialState = {
	receipts: [],
};

const ReceiptsReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'SET_RECEIPTS':
			return {
				...state,
				receipts: action.payload,
			};

		default:
			return state;
	}
};

export { ReceiptsReducer };
