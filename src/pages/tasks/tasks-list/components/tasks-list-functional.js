import React, { useEffect, useMemo, useState, useCallback } from 'react';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Popconfirm } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import ComponentToPrint from 'components/component-to-print';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import TasksListPresentational from './tasks-list-presenatational';
// import { CloseOutlined, EditOutlined } from '@ant-design/icons';
// import { deleteApi } from 'redux/sagas/deleteApiSaga';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const TasksListFunctional = React.memo(() => {
	const tasks = useSelector((state) => state?.tasksRedux?.tasks);
	const users = useSelector((state) => state?.globalRedux?.users);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [state, setState] = useState({
		visible: false,
	});
	const componentRef = React.useRef();
	const [searchKey, setSearchKey] = useState('');
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [selectedData, setSelectedData] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedViewRow, setSelectedViewRow] = useState(null);
	const [tableData, setTableData] = useState(tasks);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const getTasks = useCallback(() => {
		dispatch(getApi(ACTIONS.GET_TASKS, `${SERVER_IP}task?orgId=${globalRedux?.selectedOrganization?._id}`));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.taskName || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.description || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.priority || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(moment(record?.dueDate).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.status || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const column = [
		// {
		// 	title: '#',
		// 	dataIndex: 'taskNumber',
		// 	key: 'taskNumber',
		// 	width: '5%',
		// 	sorter: (a, b) => a?.taskNumber - b?.taskNumber,
		// 	align: 'center',
		// 	render: (value) => (
		// 		<HighlightComponent
		// 			highlightClassName="highlightClass"
		// 			searchWords={[searchKey]}
		// 			autoEscape={true}
		// 			textToHighlight={value?.toString()}
		// 		/>
		// 	),
		// },
		{
			title: 'Project',
			dataIndex: 'projectId',
			key: 'projectId',
			width: '15%',
			sorter: (a, b) => a?.projectId?.projectName?.localeCompare(b?.projectId?.projectName),
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.title || ''}
				/>
			),
		},
		{
			title: 'Task Name',
			dataIndex: 'taskName',
			key: 'taskName',
			width: '15%',
			sorter: (a, b) => a?.taskName?.localeCompare(b?.taskName),
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		// {
		// 	title: 'Description',
		// 	dataIndex: 'description',
		// 	key: 'description',
		// 	width: '15%',
		// 	sorter: (a, b) => a?.description?.localeCompare(b?.description),
		// 	render: (value) => (
		// 		<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
		// 	),
		// },
		{
			title: 'Priority',
			dataIndex: 'priority',
			key: 'priority',
			width: '10%',
			sorter: (a, b) => a?.priority?.localeCompare(b?.priority),
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'Due Date',
			dataIndex: 'dueDate',
			key: 'dueDate',
			width: '10%',
			sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
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
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: '10%',
			sorter: (a, b) => a?.status?.localeCompare(b?.status),
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'taskName',
			width: '10%',
			render: (value, row) => {
				return (
					<Row gutter={10} justify="center">
						<Col onClick={() => handleSelectRow(row)} className="edit_icon">
							<EditOutlined />
						</Col>
						{/* <Col className="edit_icon" onClick={() => setSelectedRecordToPrint(row)}>
							<PrinterOutlined />
						</Col> */}

						<Popconfirm
							title={`Are you sure to delete this Task: ${value}?`}
							okText="Delete"
							cancelText="No"
							placement="rightTop"
							onConfirm={() => {
								let url = `${SERVER_IP}task/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
								dispatch(deleteApi('DELETE_ORDER', url));
							}}>
							<Col className="delete_icon">
								<CloseOutlined />
							</Col>
						</Popconfirm>
					</Row>
				);
			},
		},
	];

	// eslint-disable-next-line
	const handleSelectRow = (row) => {
		setSelectedRow(row);
	};

	const handleTableChange = (currentPage, pageSize) => {
		setCurrentPage(currentPage === 0 ? 1 : currentPage);
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

	const onSelectChange = (selectedRowKeys, data) => {
		console.log('🚀 ~ onSelectChange ~ selectedRowKeys:', selectedRowKeys, data);
		setSelectedRowKeys(selectedRowKeys);
	};

	const onRowClick = (record) => {
		setSelectedData(record);
		console.log('🚀 ~ file: tasks-list-functional.js ~ line 189 ~ onRowClick ~ record', record);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		columnWidth: '5%',
	};

	const handleAfterPrint = () => {
		setSelectedRecordToPrint(null);
	};

	useEffect(() => {
		getTasks();
	}, [getTasks]);

	useEffect(() => {
		setTableData(tasks);
	}, [tasks]);

	const reactToPrintContent = React.useCallback(() => {
		return componentRef.current;
	}, []);

	const handlePrint = useReactToPrint({
		content: reactToPrintContent,
		documentTitle: 'Receipt',
		onAfterPrint: handleAfterPrint,
		removeAfterPrint: true,
	});

	useEffect(() => {
		selectedRecordToPrint && handlePrint();
	}, [selectedRecordToPrint, handlePrint]);

	useEffect(() => {
		selectedRow &&
			setState((state) => ({
				...state,
				visible: true,
			}));
	}, [selectedRow]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_ORDER === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_ORDER'));
			doIt = true;
		}
		if (doIt) {
			getTasks();
		}
	}, [globalRedux.apiStatus, getTasks, dispatch]);

	useEffect(() => {
		!state?.visible && setSelectedRow(null);
	}, [state?.visible]);

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_TASKS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<div style={{ display: 'none' }}>
				<ComponentToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>
			<TasksListPresentational
				{...{
					column,
					filteredData,
					handleTableChange,
					getStartingValue,
					getEndingValue,
					pageSize,
					intialPageSizeOptions,
					initialPageSize,
					currentPage,
					refreshList: getTasks,
					tableLoading,
					state,
					setState,
					editData: selectedRow,
					setSearchKey,
					rowSelection,
					selectedRowKeys,
					selectedViewRow,
					setSelectedViewRow,
					onRowClick,
					selectedData,
					setSelectedData,
					users,
				}}
			/>
		</>
	);
});

export default TasksListFunctional;
