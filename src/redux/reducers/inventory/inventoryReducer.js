let initialState = {
	inventories: [],
};

const inventoriesReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_INVENTORIES':
			return {
				...state,
				inventories: action.payload,
			};
		default:
			return state;
	}
};

export { inventoriesReducer };
