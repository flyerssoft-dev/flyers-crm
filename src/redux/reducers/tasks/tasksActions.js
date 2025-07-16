function setTasks(data) {
	return {
		type: 'SET_TASKS',
		payload: data,
	};
}

export { setTasks };
