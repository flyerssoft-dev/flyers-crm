import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Popconfirm, Row, Col } from 'antd';
// import { CloseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
// import { getDateFormat } from 'services/Utils';
// import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS } from 'constants/app-constants';
import { formQueryStringFromObject, generatePagination } from 'helpers';
import TicketListPresentational from './ticket-list-presentational';
import { Link, useNavigate, useParams } from 'react-router-dom';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const TicketListFunctional = React.memo(() => {
	const [autoRefresh, setAutoRefresh] = useState(false);
	const ticketRedux = useSelector((state) => state.ticketRedux);
	const users = useSelector((state) => state?.globalRedux?.users);
	const [selectedTicket, setSelectedTicket] = useState(null);
	const [selectedAssignedTo, setSelectedAssignedTo] = useState(null);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [visible, toggleVisible] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState('');
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(ticketRedux?.tickets || []);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	let { selectedTicketId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getTickets = useCallback(() => {
		setSelectedRowKeys([]);
		const string = formQueryStringFromObject({
			orgId: globalRedux.selectedOrganization._id,
			assignedTo: selectedAssignedTo || '',
			status: selectedStatus,
		});
		let url = `${SERVER_IP}ticket?${string}`;
		dispatch(getApi(ACTIONS.GET_TICKETS, url));
	}, [dispatch, globalRedux.selectedOrganization._id, selectedAssignedTo, selectedStatus]);

	const getTicketDetails = useCallback(
		(selectedTicketId) => {
			const string = formQueryStringFromObject({
				orgId: globalRedux.selectedOrganization._id,
			});
			let url = `${SERVER_IP}ticket/${selectedTicketId}?${string}`;
			dispatch(getApi(ACTIONS.GET_TICKETS_DETAILS, url));
		},
		[dispatch, globalRedux.selectedOrganization._id]
	);

	const getUsers = useCallback(() => {
		let url = `${SERVER_IP}user?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(getApi('GET_USERS', url));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	useEffect(() => {
		getUsers?.();
		generatePagination?.(tableData);
	}, [getUsers, tableData]);

	useEffect(() => {
		getTickets();
	}, [getTickets, selectedAssignedTo]);

	useEffect(() => {
		selectedTicketId && getTicketDetails(selectedTicketId);
	}, [getTicketDetails, selectedTicketId]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_TICKET === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_TICKET'));
			doIt = true;
		}
		if (doIt) {
			getTickets();
		}
	}, [globalRedux?.apiStatus, dispatch, getTickets]);

	useEffect(() => {
		setTableData(ticketRedux.tickets);
	}, [ticketRedux.tickets]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.ticketType || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.customerId?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.customerId?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.customerId?.email || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.ticketNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.priority || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.description || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.customerName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const column = [
		{
			title: '#',
			dataIndex: 'status',
			width: '5%',
			align: 'center',
			// fixed:'left',
			render: (value, row) => (
				<Link to={`/ticket/${row._id}`} onClick={() => setSelectedTicket(row?.ticketNumber)}>
					{row?.ticketNumber}
				</Link>
			),
		},
		{
			title: 'Customer Name',
			dataIndex: 'customerId',
			key: 'customerId',
			width: '15%',
			// fixed:'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.displayName} />,
		},
		{
			title: 'Mobile',
			dataIndex: 'customerId',
			key: 'customerId',
			width: '10%',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.mobile} />,
		},
		{
			title: 'Ticket Type',
			dataIndex: 'ticketType',
			key: 'ticketType',
			width: '15%',
			// fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			width: '25%',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Priority',
			dataIndex: 'priority',
			key: 'priority',
			width: '10%',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Assigned To',
			dataIndex: 'assignedTo',
			key: 'assignedTo',
			width: '15%',
			render: (value) => (
				<HighlightComponent
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={`${value?.firstName || ''} ${value?.lastName || ''}`}
				/>
			),
		},
		// {
		// 	title: 'Ticket No - Status',
		// 	dataIndex: 'status',
		// 	key: 'status',
		// 	width: 200,
		// 	align: 'center',
		// 	fixed: 'left',
		// 	// render: (value, row) => (
		// 	// 	<HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={`${row?.ticketNumber} - ${value}`} />
		// 	// ),
		// 	render: (value, row) => (
		// 		<Row>
		// 			<Col span={11} style={{ textAlign: 'center' }}>
		// 				<span style={{ fontWeight: 'bold' }}>{row?.ticketNumber}</span>
		// 			</Col>
		// 			<Col span={2}>-</Col>
		// 			<Col span={11}>
		// 				<span style={{ fontWeight: 'bold' }}>{value}</span>
		// 			</Col>
		// 		</Row>
		// 	),
		// },
		// {
		// 	title: 'Status',
		// 	dataIndex: 'status',
		// 	key: 'status',
		// 	width: 200,
		// 	align: 'center',
		// 	render: (value, row) => value,
		// },
		// {
		// 	title: 'Customer #',
		// 	dataIndex: 'customerId',
		// 	key: 'customerId',
		// 	width: 150,
		// 	render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.customerNumber?.toString()} />,
		// },
		// {
		// 	title: 'Customer Ref ID',
		// 	dataIndex: 'customerRefId',
		// 	key: 'customerRefId',
		// 	width: 150,
		// 	render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		// },
		// {
		// 	title: 'Action',
		// 	align: 'center',
		// 	dataIndex: 'ticketNumber',
		// 	width: 100,
		// 	render: (value, row) => {
		// 		return (
		// 			<Row justify="center">
		// 				{/* <Col><MdEdit style={{ color: 'lightblue' }} /></Col> */}
		// 				<div onClick={(event) => event.stopPropagation()}>
		// 					<Col className="delete_icon">
		// 						<Popconfirm
		// 							placement="left"
		// 							title={`Are you sure to Delete ${value} ?`}
		// 							okText="Delete"
		// 							cancelText="No"
		// 							onConfirm={() => {
		// 								let url = `${SERVER_IP}ticket/${row._id}?orgId=${globalRedux.selectedOrganization._id}`;
		// 								dispatch(deleteApi('DELETE_TICKET', url));
		// 							}}>
		// 							<CloseOutlined />
		// 						</Popconfirm>
		// 					</Col>
		// 				</div>
		// 			</Row>
		// 		);
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_TICKETS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	return (
		<TicketListPresentational
			{...{
				column,
				filteredData,
				visible,
				toggleVisible,
				handleTableChange,
				getStartingValue,
				getEndingValue,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				currentPage,
				setSearchKey,
				refreshList: getTickets,
				tableLoading,
				rowSelection,
				users,
				setSelectedAssignedTo,
				selectedStatus,
				setSelectedStatus,
				selectedTicket,
				setSelectedTicket,
				selectedTicketId,
				navigate,
				autoRefresh,
				setAutoRefresh,
				getTickets,
			}}
		/>
	);
});

export default TicketListFunctional;
