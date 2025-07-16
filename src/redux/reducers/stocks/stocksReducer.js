let initialState = {
	stocks: [],
};

const StocksReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_STOCKS':
			return {
				...state,
				stocks: action.payload,
			};
		default:
			return state;
	}
};

export { StocksReducer };
