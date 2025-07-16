let initialState = {
	staffs: [
		{
			displayName: 'sujai',
			email: 'sujai2600@gmail.com',
			mobile: '541545184845',
		},
		{
			displayName: 'subash',
			email: 'sujai26@gmail.com',
			mobile: '5415476384845',
		},
		{
			displayName: 'satish',
			email: 'sujai2600@gmail.com',
			mobile: '541437684845',
		},
		{
			displayName: 'Yuvaprasath',
			email: 'yuva@gmail.com',
			mobile: '541545184845',
		},
	],
	selectedStaffs: null,
};

const staffReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGOUT': {
			return initialState;
		}

		case 'SET_STAFFS':
			return {
				...state,
				staffs: action.payload,
			};

		case 'SET_SELECTED_STAFFS':
			return {
				...state,
				selectedStaffs: action.payload,
			};

		default:
			return state;
	}
};

export { staffReducer };
