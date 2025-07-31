import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { generatePagination } from 'helpers';
import { API_STATUS, DATE_FORMAT, STATUS } from 'constants/app-constants';
import SchedulerListPresentational from './scheduler-list-presentational';
import moment from 'moment';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const SchedulerListFunctional = React.memo(() => {
	const schedulerRedux = useSelector((state) => state.schedulerRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [schedulerAddModal, setSchedulerAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(schedulerRedux.schedulers);
	const [editScheduler, setEditScheduler] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const dispatch = useDispatch();

	const getSchedulers = useCallback(() => {
		let url = `${SERVER_IP}scheduler?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_SCHEDULERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getCustomers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getCustomers();
	}, [getCustomers]);

	useEffect(() => {
		getSchedulers();
	}, [getSchedulers]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_CUSTOMER === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_CUSTOMER'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getSchedulers();
		}
	}, [globalRedux.apiStatus, dispatch, getSchedulers]);

	useEffect(() => {
		setTableData(schedulerRedux.schedulers);
	}, [schedulerRedux.schedulers]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((scheduler) => {
			return (
				(scheduler?.customerId?.displayName || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(scheduler?.remarks || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(scheduler?.status || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(moment(scheduler?.date).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(moment(scheduler?.dueDate).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(scheduler?.refNumber || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditScheduler(rowData);
		setSchedulerAddModal(true);
	};

	const handleAddScheduler = () => {
		setEditScheduler(null);
		setSchedulerAddModal(true);
	};

	const column = [
		{
			title: '#',
			dataIndex: 'schedulerNumber',
			key: 'schedulerNumber',
			sorter: (a, b) => a?.schedulerNumber - b?.schedulerNumber,
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
			title: 'Customer',
			dataIndex: 'customerId',
			key: 'customerId',
			sorter: (a, b) => a?.customerId?.displayName?.localeCompare(b?.customerId?.displayName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent
						highlightClassName="highlightClass"
						searchWords={[searchKey]}
						autoEscape={true}
						textToHighlight={value?.displayName}
					/>
				</div>
			),
		},
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			width: '10%',
			sorter: (a, b) => new Date(a.date) - new Date(b.date),
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={moment(value).format(DATE_FORMAT.DD_MM_YYYY)}
				/>
			),
		},
		{
			title: 'Reference No',
			dataIndex: 'refNumber',
			key: 'refNumber',
			width: '10%',
			sorter: (a, b) => a?.refNumber?.localeCompare(b?.refNumber),
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			sorter: (a, b) => a?.amount - b?.amount,
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.toString()} />,
		},
		{
			title: 'Due Date',
			dataIndex: 'dueDate',
			align: 'left',
			width: '15%',
			sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
			render: (value) =>
				value ? (
					<HighlightComponent
						highlightClassName="highlightClass"
						searchWords={[searchKey]}
						autoEscape={true}
						textToHighlight={moment(value).format(DATE_FORMAT.DD_MM_YYYY)}
					/>
				) : (
					'-'
				),
		},
		{
			title: 'Remarks',
			dataIndex: 'remarks',
			sorter: (a, b) => a?.remarks?.localeCompare(b?.remarks),
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: '10%',
			align: 'center',
			sorter: (a, b) => a?.status?.localeCompare(b?.status),
			render: (value) => (value ? <Tag color={STATUS[value]}>{value}</Tag> : null),
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'displayName',
			render: (value, row, index) => {
				return (
					<Row justify="center">
						<Col className="edit_icon" onClick={() => handleDrawer(row)}>
							<EditOutlined />
						</Col>
					</Row>
				);
			},
		},
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_SCHEDULERS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	const handleClose = useCallback(() => {
		setSchedulerAddModal(false);
		setEditScheduler(null);
	}, [setSchedulerAddModal, setEditScheduler]);

	return (
		<SchedulerListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddScheduler,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				schedulerAddModal,
				setSchedulerAddModal,
				refreshList: getSchedulers,
				editScheduler,
				handleClose,
			}}
		/>
	);
});

export default SchedulerListFunctional;
