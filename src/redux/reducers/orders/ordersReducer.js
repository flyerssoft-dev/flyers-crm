let initialState = {
	orders: [],
};

const OrdersReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_ORDERS':
			return {
				...state,
				orders: action.payload,
			};
		default:
			return state;
	}
};

export { OrdersReducer };
