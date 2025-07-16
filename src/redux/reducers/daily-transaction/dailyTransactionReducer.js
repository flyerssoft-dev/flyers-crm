let initialState = {
	dailyTransaction: [],
};

const dailyTransactionReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'GET_DAILY_TRANSACTION_LIST':
			return {
				...state,
				dailyTransaction: action.payload,
			};
		default:
			return state;
	}
};

export { dailyTransactionReducer };
