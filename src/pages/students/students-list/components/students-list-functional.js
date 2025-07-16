import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popconfirm, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS } from 'constants/app-constants';
import { generatePagination } from 'helpers';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import StudentListPresentational from './students-list-presentational';

const initialPageSize = 20;
const intialPageSizeOptions = [20, 40, 80];

const StudentListFunctional = React.memo((props) => {
	const studentsRedux = useSelector((state) => state.studentsRedux);
	const users = useSelector((state) => state?.userRedux?.users);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [visible, toggleVisible] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(studentsRedux?.students || []);
	const [currentPage, setCurrentPage] = useState(1);
	const [state, setState] = useState({
		selectedRow: null,
		visible: false,
	});
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const getStudents = useCallback(
		() => () => {
			dispatch(getApi(ACTIONS.GET_STUDENTS, `${SERVER_IP}student?orgId=${globalRedux?.selectedOrganization?._id}`));
		},
		[dispatch, globalRedux?.selectedOrganization?._id]
	);

	useEffect(() => {
		getStudents();
		generatePagination(tableData);
	}, [getStudents, tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_STUDENT === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_STUDENT'));
			doIt = true;
		}
		if (doIt) {
			getStudents();
		}
	}, [globalRedux.apiStatus, dispatch, getStudents]);

	useEffect(() => {
		setTableData(studentsRedux?.students);
		!state?.visible && state?.selectedRow && setState((state) => ({ ...state, selectedRow: null }));
	}, [studentsRedux?.students, state?.visible, state?.selectedRow]);

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

	const handleEdit = (rowData) => {
		setState({
			...state,
			selectedRow: rowData,
			visible: true,
		});
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
			title: 'Class',
			dataIndex: 'classId',
			key: 'classId',
			width: 100,
			render: (value, row) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={`${value?.className || ''} - ${row?.section || ''}`}
				/>
			),
		},
		{
			title: 'Father Name',
			dataIndex: 'fatherName',
			key: 'fatherName',
			width: 150,
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Primary Mobile',
			dataIndex: 'primaryMobile',
			key: 'primaryMobile',
			width: 150,
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Aadhar Card',
			dataIndex: 'aadharCard',
			key: 'aadharCard',
			// fixed: 'left',
			width: 100,
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Fees Balance',
			dataIndex: 'outstandingBalance',
			key: 'outstandingBalance',
			width: 100,
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.toString()} />,
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'studentName',
			width: 100,
			render: (value, row) => {
				return (
					<Row gutter={10} justify="center">
						<Col onClick={() => handleEdit(row)} className="edit_icon">
							<EditOutlined />
						</Col>
						<Col className="delete_icon">
							<Popconfirm
								title={`Are you sure to Delete ${value}?`}
								okText="Delete"
								cancelText="No"
								placement="rightTop"
								onConfirm={() => {
									let url = `${SERVER_IP}student/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
									dispatch(deleteApi('DELETE_STUDENT', url));
								}}>
								<CloseOutlined />
							</Popconfirm>
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_TICKETS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	return (
		<StudentListPresentational
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
				tableLoading,
				rowSelection,
				users,
				state,
				setState,
			}}
		/>
	);
});

export default StudentListFunctional;
