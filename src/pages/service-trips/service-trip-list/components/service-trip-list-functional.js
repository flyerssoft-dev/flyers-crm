import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Row, Col } from 'antd';
// import { EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { generatePagination } from 'helpers';
import { API_STATUS } from 'constants/app-constants';
import ServiceTripsListPresentational from './service-trip-list-presentational';
import { getDateFormat } from 'services/Utils';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const ServiceTripsListFunctional = React.memo(() => {
	const serviceTripsRedux = useSelector((state) => state.serviceTripsRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [serviceTripAddModal, setServiceTripsAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(serviceTripsRedux.serviceTrips);
	const [editServiceTrips, setEditServiceTrips] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const dispatch = useDispatch();

	const getServiceTrips = useCallback(() => {
		let url = `${SERVER_IP}servicetrip?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_SERVICE_TRIPS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getServiceTrips();
	}, [getServiceTrips]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_SERVICE_TRIP === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_SERVICE_TRIP'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getServiceTrips();
		}
	}, [globalRedux.apiStatus, dispatch, getServiceTrips]);

	useEffect(() => {
		setTableData(serviceTripsRedux.serviceTrips);
	}, [serviceTripsRedux.serviceTrips]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((serviceTrip) => {
			return (
				(serviceTrip?.servicetripNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(serviceTrip?.userId?.firstName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(serviceTrip?.vehicleId?.regNumber || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	// const handleDrawer = (rowData) => {
	// 	setEditServiceTrips(rowData);
	// 	setServiceTripsAddModal(true);
	// };

	const handleAddServiceTrips = () => {
		setEditServiceTrips(null);
		setServiceTripsAddModal(true);
	};

	const column = [
		{
			title: '#',
			dataIndex: 'servicetripNumber',
			key: 'servicetripNumber',
			width: '5%',
			sorter: (a, b) => a?.servicetripNumber - b?.servicetripNumber,
			fixed: 'left',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.toString()}
				/>
			),
		},
		{
			title: 'Staff Name',
			dataIndex: 'userId',
			key: 'userId',
			sorter: (a, b) => a?.userId?.firstName?.localeCompare(b?.userId?.firstName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={`${value?.firstName} ${value?.lastName}`} />
				</div>
			),
		},
		{
			title: 'Date',
			dataIndex: 'createdAt',
			align: 'left',
			render: (value) => getDateFormat(value),
		},
		{
			title: 'Vehicle',
			dataIndex: 'vehicleId',
			sorter: (a, b) => a?.vehicleId?.regNumber?.localeCompare(b?.vehicleId?.regNumber),
			align: 'left',
			width: '15%',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.regNumber} />,
		},
		{
			title: 'Starting KMS',
			dataIndex: 'openingKMS',
			// sorter: (a, b) => a?.openingKMS?.localeCompare(b?.openingKMS),
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Closing KMS',
			dataIndex: 'closingKMS',
			// sorter: (a, b) => a?.openingKMS?.localeCompare(b?.openingKMS),
			align: 'left',
			// render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Total KMS',
			dataIndex: 'totalKMS',
			// sorter: (a, b) => a?.openingKMS?.localeCompare(b?.openingKMS),
			align: 'left',
			// render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			sorter: (a, b) => a?.status?.localeCompare(b?.status),
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		// {
		// 	title: 'Balance',
		// 	dataIndex: 'outstandingBalance',
		// 	align: 'right',
		// 	sorter: (a, b) => a?.outstandingBalance - b?.outstandingBalance,
		// 	render: (value) => {
		// 		if (!!value) {
		// 			return <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value.toFixed(2)} />;
		// 		} else {
		// 			return <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={(0).toFixed(2)} />;
		// 		}
		// 	},
		// },
	];

	const handleTableChange = (currentPage, pageSize) => {
		setCurrentPage(currentPage);
		setPageSize(pageSize);
	};

	const getStartingValue = () => {
		if (currentPage === 1) return 1;
		else {
			return (currentPage - 1) * pageSize + 1;
		}
	};

	const getEndingValue = () => {
		if (currentPage === 1) return tableData.length < pageSize ? tableData.length : pageSize;
		else {
			let end = currentPage * pageSize;
			return end > tableData.length ? tableData.length : end;
		}
	};

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_SERVICE_TRIPS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	const handleClose = useCallback(() => {
		setServiceTripsAddModal(false);
		setEditServiceTrips(null);
	}, [setServiceTripsAddModal, setEditServiceTrips]);

	return (
		<ServiceTripsListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddServiceTrips,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				serviceTripAddModal,
				setServiceTripsAddModal,
				refreshList: getServiceTrips,
				editServiceTrips,
				handleClose,
			}}
		/>
	);
});

export default ServiceTripsListFunctional;
