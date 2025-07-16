let initialState = {
	suppliers: [],
};

const supplierReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_SUPPLIERS':
			return {
				...state,
				suppliers: action.payload,
			};
		default:
			return state;
	}
};

export { supplierReducer };
