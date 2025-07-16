function setStocks(data) {
	return {
		type: 'SET_STOCKS',
		payload: data,
	};
}

export { setStocks };
