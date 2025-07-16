let initialState = {
	invoices: [],
};

const invoiceReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'GET_INVOICES':
			return {
				...state,
				invoices: action.payload,
			};
		default:
			return state;
	}
};

export { invoiceReducer };
