import React, { useEffect, useMemo, useState, useCallback } from 'react';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import { Tag, Row, Col, Popconfirm } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, DATE_FORMAT, STATUS } from 'constants/app-constants';
import ComponentToPrint from 'components/component-to-print';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import CompositeListPresentational from './composites-list-presenatational';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
// import { CloseOutlined, EditOutlined } from '@ant-design/icons';
// import { deleteApi } from 'redux/sagas/deleteApiSaga';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const CompositeListFunctional = React.memo(() => {
	const composites = useSelector((state) => state?.compositesRedux?.composites);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [state, setState] = useState({
		visible: false,
	});
	const componentRef = React.useRef();
	const [searchKey, setSearchKey] = useState('');
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedViewRow, setSelectedViewRow] = useState(null);
	const [tableData, setTableData] = useState(composites);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const getComposites = useCallback(() => {
		dispatch(getApi(ACTIONS.GET_COMPOSITES, `${SERVER_IP}composite?orgId=${globalRedux?.selectedOrganization?._id}`));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.compositeNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.itemId?.itemName || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(moment(record?.date).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const column = [
		{
			title: '#',
			dataIndex: 'compositeNumber',
			key: 'compositeNumber',
			width: '5%',
			sorter: (a, b) => a?.compositeNumber - b?.compositeNumber,
			align: 'center',
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
			title: 'Item',
			dataIndex: 'itemId',
			key: 'itemId',
			width: '15%',
			sorter: (a, b) => a?.itemId?.displayName?.localeCompare(b?.itemId?.displayName),
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.itemName || ''}
				/>
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
			title: 'Remarks',
			dataIndex: 'remarks',
			key: 'remarks',
			width: '10%',
			align: 'center',
			sorter: (a, b) => a?.remarks?.localeCompare(b?.remarks),
			render: (value) => (value ? <Tag color={STATUS[value]}>{value}</Tag> : null),
			// render: (value) => (
			// 	<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			// ),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: '10%',
			align: 'center',
			sorter: (a, b) => a?.status?.localeCompare(b?.status),
			render: (value) => (value ? <Tag color={STATUS[value]}>{value}</Tag> : null),
			// render: (value) => (
			// 	<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			// ),
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'compositeNumber',
			width: '10%',
			render: (value, row) => {
				return (
					<Row gutter={10} justify="center">
						<Col onClick={() => handleSelectRow(row)} className="edit_icon">
							<EditOutlined />
						</Col>
						<Popconfirm
							title={`Are you sure to delete this composite: ${value}?`}
							okText="Delete"
							cancelText="No"
							placement="rightTop"
							onConfirm={() => {
								let url = `${SERVER_IP}composite/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
								dispatch(deleteApi('DELETE_COMPOSITE', url));
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

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
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
		getComposites();
	}, [getComposites]);

	useEffect(() => {
		setTableData(composites);
	}, [composites]);

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
		if (globalRedux.apiStatus.DELETE_COMPOSITE === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_COMPOSITE'));
			doIt = true;
		}
		if (doIt) {
			getComposites();
		}
	}, [globalRedux.apiStatus, getComposites, dispatch]);

	useEffect(() => {
		!state?.visible && setSelectedRow(null);
	}, [state?.visible]);

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_COMPOSITES === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<div style={{ display: 'none' }}>
				<ComponentToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>
			<CompositeListPresentational
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
					refreshList: getComposites,
					tableLoading,
					state,
					setState,
					editData: selectedRow,
					setSearchKey,
					rowSelection,
					selectedRowKeys,
					selectedViewRow,
					setSelectedViewRow,
				}}
			/>
		</>
	);
});

export default CompositeListFunctional;
