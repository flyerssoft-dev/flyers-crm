function setDashboardData(data) {
	return {
		type: 'GET_DASHBOARD_DATA',
		payload: data,
	};
}

export { setDashboardData };
