let initialState = {
	subItems: [],
};

const subItemReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_SUB_ITEMS':
			return {
				...state,
				subItems: action.payload,
			};

		default:
			return state;
	}
};

export { subItemReducer };
