let initialState = {
	taxInvoices: [],
};

const taxInvoicesReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_TAX_INVOICES':
			return {
				...state,
				taxInvoices: action.payload,
			};
		default:
			return state;
	}
};

export { taxInvoicesReducer };
