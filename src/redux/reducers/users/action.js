function setUsers(data) {
	return {
		type: 'SET_USERS',
		payload: data,
	};
}

function setSelectedUser(data) {
	return {
		type: 'SET_SELECTED_USER',
		payload: data,
	};
}

function userDetails(data) {
	return {
		type: 'GET_USER_DETAILS',
		payload: data,
	};
}

export { setUsers, setSelectedUser, userDetails };
