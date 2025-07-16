function setAccBooks(data) {
	return {
		type: 'SET_ACC_BOOKS',
		payload: data,
	};
}

function setSelectedStaffs(data) {
	return {
		type: 'SET_SELECTED_STAFFS',
		payload: data,
	};
}

export { setAccBooks, setSelectedStaffs };
