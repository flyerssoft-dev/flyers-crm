let initialState = {
	composites: [],
};

const compositesReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_COMPOSITES':
			return {
				...state,
				composites: action.payload,
			};
		default:
			return state;
	}
};

export { compositesReducer };
