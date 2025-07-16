import React, { useEffect, useMemo, useState } from 'react';
import { InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS } from 'constants/app-constants';
import { sendGetRequest } from 'redux/sagas/utils';
import { postApi } from 'redux/sagas/postApiDataSaga';
import FeesBalancePresentational from './fees-balance-list-presenatational';

const initialPageSize = 20;
const intialPageSizeOptions = [20, 40, 80];

const FeesBalanceFunctional = React.memo((props) => {
	const [selectedClass, setSelectedClass] = useState(null);
	const users = useSelector((state) => state?.userRedux?.users);
	const globalRedux = useSelector((state) => state.globalRedux);
	const classes = globalRedux?.classes || [];
	const [visible, toggleVisible] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const getStudents = () => {
		dispatch(getApi(ACTIONS.GET_STUDENTS, `${SERVER_IP}student?orgId=${globalRedux?.selectedOrganization?._id}`));
	};

	useEffect(() => {
		getStudents();
	}, []);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_INVOICE === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_INVOICE'));
			doIt = true;
		}
		if (doIt) {
			getStudents();
		}
	}, [globalRedux.apiStatus, dispatch]);

	const handleGetStudents = (classId) => {
		setSelectedClass(classId);
	};

	useEffect(async () => {
		if (selectedClass) {
			await setLoading(true);
			const {
				data: { data },
			} = await sendGetRequest(null, `${SERVER_IP}student?orgId=${globalRedux?.selectedOrganization?._id}&classId=${selectedClass}`);
			setTableData(data);
			await setLoading(false);
		}
	}, [selectedClass]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.ticketType || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.priority || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.customerName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleEdit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?._id,
			batchId: globalRedux?.activeBatch,
			categoryId: '62913099d2abfb4a1432729a',
			feesAmount: values?.outstandingBalance,
			studentId: values?._id,
		};
		dispatch(postApi(data, 'ADD_BATCH_BALANCE'));
	};

	const handleEditTableData = (outstandingBalance, row) => {
		let newTableData = tableData.map((record) => {
			if (record._id === row._id) {
				return {
					...record,
					outstandingBalance,
				};
			}
			return record;
		});
		setTableData(newTableData);
	};

	const column = [
		{
			title: 'Ad. No',
			dataIndex: 'admissionNumber',
			key: 'admissionNumber',
			// fixed: 'left',
			width: 100,
			sorter: (a, b) => a.admissionNumber - b.admissionNumber,
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Student Name',
			dataIndex: 'studentName',
			key: 'studentName',
			fixed: 'left',
			width: 150,
			sorter: (a, b) => a.studentName.length - b.studentName.length,
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Unicode Name',
			dataIndex: 'unicodeName',
			key: 'unicodeName',
			fixed: 'left',
			width: 150,
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Student Type',
			dataIndex: 'studentType',
			key: 'studentType',
			width: '20%',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Fees Balance',
			dataIndex: 'outstandingBalance',
			key: 'outstandingBalance',
			width: '20%',
			render: (value, row) => (
				<InputNumber value={value} onBlur={() => handleEdit(row)} onChange={(value) => handleEditTableData(value, row)} />
			),
		},
		// {
		// 	title: 'Action',
		// 	align: 'center',
		// 	dataIndex: 'displayName',
		// 	render: (value, row, index) => {
		// 		return (
		// 			<Row>
		// 				<Col>{/* <MdEdit style={{ color: 'lightblue' }} /> */}</Col>
		// 				<Col>
		// 					{/* Confirmation Popup */}
		// 					<Popconfirm
		// 						title={`Are you sure to Delete ${value}?`}
		// 						okText="Delete"
		// 						cancelText="No"
		// 						onConfirm={() => {
		// 							let url = `${SERVER_IP}invoice/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
		// 							dispatch(deleteApi('DELETE_INVOICE', url));
		// 						}}>
		// 						<IoCloseSharp style={{ color: 'red' }} />
		// 					</Popconfirm>
		// 				</Col>
		// 			</Row>
		// 		);
		// 	},
		// },
	];

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

	// const tableLoading = useMemo(() => globalRedux.apiStatus.GET_TICKETS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	return (
		<FeesBalancePresentational
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
				refreshList: getStudents,
				tableLoading: loading,
				rowSelection,
				users,
				classes,
				handleGetStudents,
				loading,
			}}
		/>
	);
});

export default FeesBalanceFunctional;
