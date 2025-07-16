function setStaffs(data) {
	return {
		type: 'SET_STAFFS',
		payload: data,
	};
}

function setSelectedStaffs(data) {
	return {
		type: 'SET_SELECTED_STAFFS',
		payload: data,
	};
}

export { setStaffs, setSelectedStaffs };
