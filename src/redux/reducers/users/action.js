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

export { setUsers, setSelectedUser };
