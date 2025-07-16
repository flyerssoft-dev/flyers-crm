import React, { useEffect, useMemo, useState, useCallback } from 'react';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import { Tag, Row, Col, Popconfirm, Tooltip } from 'antd';
import {
	// EditOutlined,
	CloseOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, DATE_FORMAT, STATUS } from 'constants/app-constants';
import ComponentToPrint from 'components/component-to-print';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import InventoryListPresentational from './inventory-list-presenatational';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
// import { CloseOutlined, EditOutlined } from '@ant-design/icons';
// import { deleteApi } from 'redux/sagas/deleteApiSaga';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const InventoryListFunctional = React.memo(() => {
	const inventories = useSelector((state) => state?.inventoriesRedux?.inventories);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [state, setState] = useState({
		visible: false,
	});
	const componentRef = React.useRef();
	const [searchKey, setSearchKey] = useState('');
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedViewRow, setSelectedViewRow] = useState(null);
	const [tableData, setTableData] = useState(inventories);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [
		selectedRowKeys,
		// setSelectedRowKeys
	] = useState([]);
	const dispatch = useDispatch();

	const getOrders = useCallback(() => {
		dispatch(getApi(ACTIONS.GET_INVENTORIES, `${SERVER_IP}inventory?orgId=${globalRedux?.selectedOrganization?._id}`));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.inventoryNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.referenceNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.inventoryMode || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(moment(record?.date).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.status || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleViewRow = (row) => {
		setSelectedViewRow(row);
	};

	const column = [
		{
			title: '#',
			dataIndex: 'inventoryNumber',
			key: 'inventoryNumber',
			width: '5%',
			sorter: (a, b) => a?.inventoryNumber - b?.inventoryNumber,
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
			title: 'Inventory Mode',
			dataIndex: 'inventoryMode',
			key: 'inventoryMode',
			width: '15%',
			sorter: (a, b) => a?.inventoryMode?.localeCompare(b?.inventoryMode),
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'Stock Type',
			dataIndex: 'stockType',
			key: 'stockType',
			width: '10%',
			sorter: (a, b) => a?.stockType?.localeCompare(b?.stockType),
			render: (value) => (value ? <Tag style={{
				fontSize: '1rem'
			}} color={STATUS[value]}>{value}</Tag> : null),
			// render(value) {
			// 	return {
			// 		props: {
			// 			style: { background: value !== 'Add' ? '#fca0a0' : '#a2e2a2' },
			// 		},
			// 		children: (
			// 			<HighlightComponent
			// 				highlightClassName="highlightClass"
			// 				searchWords={[searchKey]}
			// 				autoEscape={true}
			// 				textToHighlight={value || ''}
			// 			/>
			// 		),
			// 	};
			// },
		},
		{
			title: 'Reference No',
			dataIndex: 'referenceNumber',
			key: 'referenceNumber',
			width: '10%',
			sorter: (a, b) => a?.referenceNumber?.localeCompare(b?.referenceNumber),
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'Reason',
			dataIndex: 'reason',
			key: 'reason',
			width: '10%',
			sorter: (a, b) => a?.reason?.localeCompare(b?.reason),
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		// {
		// 	title: 'Total Amount',
		// 	dataIndex: 'totalAmount',
		// 	key: 'totalAmount',
		// 	width: '10%',
		// 	sorter: (a, b) => a?.totalAmount - b?.totalAmount,
		// 	align: 'right',
		// 	render: (value) => (
		// 		<HighlightComponent
		// 			highlightClassName="highlightClass"
		// 			searchWords={[searchKey]}
		// 			autoEscape={true}
		// 			textToHighlight={parseFloat(value)?.toFixed(2)}
		// 		/>
		// 	),
		// },
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
			dataIndex: 'inventoryNumber',
			width: '10%',
			render: (value, row) => {
				return (
					<Row gutter={10} justify="center">
						{row?.items?.length > 0 && (
							<Tooltip placement="left" title={`View ${row?.items?.length} Item${row?.items?.length > 1 ? 's' : ''}`}>
								<Col
									onClick={() => {
										handleViewRow(row);
									}}
									className="edit_icon">
									<EyeOutlined />
								</Col>
							</Tooltip>
						)}
						{/* <Col onClick={() => handleSelectRow(row)} className="edit_icon">
							<EditOutlined />
						</Col> */}
						<Popconfirm
							title={`Are you sure to delete this ${value}?`}
							okText="Delete"
							cancelText="No"
							placement="rightTop"
							onConfirm={() => {
								let url = `${SERVER_IP}inventory/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
								dispatch(deleteApi('DELETE_INVENTORY', url));
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

	// const onSelectChange = (selectedRowKeys) => {
	// 	setSelectedRowKeys(selectedRowKeys);
	// };

	// const rowSelection = {
	// 	selectedRowKeys,
	// 	onChange: onSelectChange,
	// 	columnWidth: '5%',
	// };

	const handleAfterPrint = () => {
		setSelectedRecordToPrint(null);
	};

	useEffect(() => {
		getOrders();
	}, [getOrders]);

	useEffect(() => {
		setTableData(inventories);
	}, [inventories]);

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
		if (globalRedux.apiStatus.DELETE_INVENTORY === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_INVENTORY'));
			doIt = true;
		}
		if (doIt) {
			getOrders();
		}
	}, [globalRedux.apiStatus, getOrders, dispatch]);

	useEffect(() => {
		!state?.visible && setSelectedRow(null);
	}, [state?.visible]);

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_INVENTORIES === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<div style={{ display: 'none' }}>
				<ComponentToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>
			<InventoryListPresentational
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
					refreshList: getOrders,
					tableLoading,
					state,
					setState,
					editData: selectedRow,
					setSearchKey,
					// rowSelection,
					selectedRowKeys,
					selectedViewRow,
					setSelectedViewRow,
				}}
			/>
		</>
	);
});

export default InventoryListFunctional;
