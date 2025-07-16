let initialState = {
	vouchers: [],
};

const voucherReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'SET_VOUCHERS':
			return {
				...state,
				vouchers: action.payload,
			};
		default:
			return state;
	}
};

export { voucherReducer };
