function setInventories(data) {
	return {
		type: 'SET_INVENTORIES',
		payload: data,
	};
}

export { setInventories };
