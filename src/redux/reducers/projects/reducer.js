let initialState = {
	projects: [],
	selectedProject: null,
	projectDetails: {},
};

const projectReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_PROJECTS':
			return {
				...state,
				projects: action.payload,
			};

		case 'SET_SELECTED_PROJECT':
			return {
				...state,
				selectedProject: action.payload,
			};

		case 'GET_PROJECTS_DETAILS':
			return {
				...state,
				projectDetails: action.payload,
			};

		default:
			return state;
	}
};

export { projectReducer };
