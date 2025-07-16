let initialState = {
	agents: [],
};

const agentReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'GET_AGENTS':
			return {
				...state,
				agents: action.payload,
			};
		default:
			return state;
	}
};

export { agentReducer };
