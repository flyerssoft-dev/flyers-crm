import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { objToQs } from 'helpers';
import { SERVER_IP } from 'assets/Config';
import { ACTIONS } from 'constants/app-constants';
import { getApi } from 'redux/sagas/getApiDataSaga';
import DashboardPresentational from './dashboard-presentational';

const DashboardFunctional = () => {
	const [selectedBranchId, setSelectedBranchId] = useState('');
	const globalRedux = useSelector((state) => state.globalRedux);
	const loginRedux = useSelector((state) => state.loginRedux);
	const dashboardData = useSelector(({ dashboardRedux }) => dashboardRedux?.dashboard);
	const tableData = dashboardData?.totalTickets?.map((ticket) => ({
		Username: ticket?.userInfo?.firstName||ticket?.userInfo?.lastName?`${ticket?.userInfo?.firstName || ""} ${ticket?.userInfo?.lastName || ''}`: "Unassigned",
		Open: ticket?.statusCount?.Open || 0,
		Completed: ticket?.statusCount?.Completed || 0,
		Accepted: ticket?.statusCount?.Accepted || 0,
		Pending: ticket?.statusCount?.Pending || 0,
		InProgress: ticket?.statusCount?.InProgress || 0,
	}));
	const branches = useSelector(({ globalRedux: { branches } }) => branches);

	const dispatch = useDispatch();

	const getDashboardData = useCallback(() => {
		let url = `${SERVER_IP}dashboard/?${objToQs({
			orgId: globalRedux?.selectedOrganization?.id,
			areaId: selectedBranchId,
		})}`;
		dispatch(getApi(ACTIONS.GET_DASHBOARD_DATA, url));
	}, [dispatch, globalRedux?.selectedOrganization?.id, selectedBranchId]);

	useEffect(() => {
		getDashboardData();
	}, [getDashboardData, selectedBranchId]);

	return <DashboardPresentational {...{ dashboardData, tableData, loginRedux, branches, setSelectedBranchId }} />;
};

export default DashboardFunctional;
