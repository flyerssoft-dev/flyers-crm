import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { sendGetRequest } from 'redux/sagas/utils';
import { SERVER_IP } from 'assets/Config';
import { ACTIONS, API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import HighlightComponent from 'components/HighlightComponent';
import ComponentToPrint from 'components/component-to-print';
import LoadInPresentational from './load-in-list-presenatational';
import { getDateFormat } from 'services/Utils';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const LoadInFunctional = React.memo((props) => {
	const componentRef = React.useRef();
	const [state, setState] = useState({
		visible: false,
	});
	const [searchKey, setSearchKey] = useState('');
	const [selectedClass, setSelectedClass] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const globalRedux = useSelector((state) => state.globalRedux);
	const loadIn = useSelector((state) => state.loadInRedux?.loadIn);
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [tableData, setTableData] = useState(loadIn);
	const dispatch = useDispatch();

	const getLoadIn = useCallback(() => {
		dispatch(getApi(ACTIONS.GET_LOAD_IN, `${SERVER_IP}load?orgId=${globalRedux?.selectedOrganization?.id}`));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const handleGetStudents = (classId) => {
		setSelectedClass(classId);
	};

	const getLoadInByClassId = useCallback(
		async (selectedClass) => {
			if (selectedClass) {
				const {
					data: { data },
				} = await sendGetRequest(null, `${SERVER_IP}student?orgId=${globalRedux?.selectedOrganization?.id}&classId=${selectedClass}`);
				setTableData(data);
			}
		},
		[setTableData, globalRedux?.selectedOrganization?.id]
	);

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

	const column = [
		{
			title: 'Load #',
			dataIndex: 'loadNumber',
			key: 'loadNumber',
			width: '15%',
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
			title: 'Load Date',
			dataIndex: 'loadDate',
			key: 'loadDate',
			width: '15%',
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
			title: 'Driver Name',
			dataIndex: 'driverName',
			key: 'driverName',
			width: '15%',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'Driver Mobile',
			dataIndex: 'driverMobile',
			key: 'driverMobile',
			width: '15%',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			align: 'left',
			render: (value) => getDateFormat(value),
		},
		{
			title: 'Created By',
			dataIndex: 'createdBy',
			align: 'left',
			render: (value) => value?.firstName,
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'voucherNumber',
			width: '10%',
			render: (value, row, index) => {
				return (
					<Row gutter={10} justify="center">
						<Col onClick={() => handleSelectRow(row)} className="edit_icon">
							<EditOutlined />
						</Col>
						{/* <Col className="delete_icon">
							<Col style={{ padding: 0 }} onClick={() => setSelectedRecordToPrint(row)}>
								<PrinterOutlined />
							</Col>
						</Col> */}
					</Row>
				);
			},
		},
	];

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

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleAfterPrint = () => {
		setSelectedRecordToPrint(null);
	};

	useEffect(() => {
		getLoadIn();
	}, [getLoadIn]);

	useEffect(() => {
		setTableData(loadIn);
	}, [loadIn]);

	useEffect(() => {
		getLoadInByClassId(selectedClass);
	}, [selectedClass, getLoadInByClassId]);

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
		!state?.visible && setSelectedRow(null);
	}, [state?.visible, setSelectedRow]);

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_TICKETS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<div style={{ display: 'none' }}>
				<ComponentToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>
			<LoadInPresentational
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
					setSearchKey,
					refreshList: getLoadIn,
					tableLoading,
					rowSelection,
					handleGetStudents,
					state,
					setState,
					editData: selectedRow,
				}}
			/>
		</>
	);
});

export default LoadInFunctional;
