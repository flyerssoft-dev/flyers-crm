import React, { useEffect, useMemo, useState } from 'react';
import { Popconfirm, Row, Col, Tag } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, DATE_FORMAT, STATUS } from 'constants/app-constants';
import { convertToIndianRupees, generatePagination } from 'helpers';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import ReceiptListPresentational from './receipt-list-presentational';

const initialPageSize = 20;
const intialPageSizeOptions = [20, 40, 80];

const ReceiptListFunctional = React.memo((props) => {
	const receiptsRedux = useSelector((state) => state.receiptsRedux);
	const users = useSelector((state) => state?.userRedux?.users);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [visible, toggleVisible] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(receiptsRedux?.receipts || []);
	const [currentPage, setCurrentPage] = useState(1);
	const [state, setState] = useState({
		selectedRow: null,
		visible: false,
	});
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const getReceipts = () => {
		dispatch(getApi(ACTIONS.GET_RECEIPTS, `${SERVER_IP}receipt?orgId=${globalRedux.selectedOrganization._id}`));
	};

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_RECEIPT === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_RECEIPT'));
			doIt = true;
		}
		if (doIt) {
			getReceipts();
		}
	}, [globalRedux.apiStatus]);

	useEffect(() => {
		getReceipts();
		generatePagination(tableData);
	}, []);

	useEffect(() => {
		setTableData(receiptsRedux?.receipts);
	}, [receiptsRedux?.receipts]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.receiptNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.customer?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(moment(record?.receiptDate).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				// (record?.invoiceId?.invoiceNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.paymentMode || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.receiptAmount || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
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
			title: '#',
			dataIndex: 'receiptNumber',
			key: 'receiptNumber',
			sorter: (a, b) => a?.receiptNumber - b?.receiptNumber,
			width: '5%',
		},
		{
			title: 'Receipt Date',
			dataIndex: 'receiptDate',
			sorter: (a, b) => new Date(a.receiptDate) - new Date(b.receiptDate),
			key: 'receiptDate',
			width: '15%',
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={moment(value).format(DATE_FORMAT.DD_MM_YYYY)} />,
		},
		{
			title: 'Customer',
			sorter: (a, b) => a?.customer?.displayName?.localeCompare(b?.customer?.displayName),
			dataIndex: 'customer',
			key: 'customer',
			width: '15%',
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.displayName?.toString()} />,
		},
		{
			title: 'Invoice No',
			// sorter: (a, b) => a?.invoiceId?.invoiceNumber?.localeCompare(b?.invoiceId?.invoiceNumber),
			dataIndex: 'invoices',
			key: 'invoices',
			width: '15%',
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.length ? value?.map((invoice) => invoice?.invoiceNumber)?.join(', ') : ''} />,
		},
		{
			title: 'Amount',
			sorter: (a, b) => a?.receiptAmount - b?.receiptAmount,
			dataIndex: 'receiptAmount',
			key: 'receiptAmount',
			align: 'right',
			width: '15%',
			render: (value) => <span>{convertToIndianRupees(value)}</span>
		},
		{
			title: 'Payment Mode',
			sorter: (a, b) => a?.paymentMode?.localeCompare(b?.paymentMode),
			dataIndex: 'paymentMode',
			key: 'paymentMode',
			width: '15%',
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.toString()?.toUpperCase()} />,
		},
		{
			title: 'Remarks',
			sorter: (a, b) => a?.remarks?.localeCompare(b?.remarks),
			dataIndex: 'remarks',
			key: 'remarks',
			width: '10%',
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'studentName',
			width: '10%',
			render: (value, row) => {
				return (
					<Row gutter={10} justify="center">
						<Col onClick={() => handleEdit(row)} className="edit_icon">
							<EditOutlined />
						</Col>
						<Col className="delete_icon">
							<Popconfirm
								title={`Are You Sure to Delete?`}
								okText="Delete"
								cancelText="No"
								placement="rightTop"
								onConfirm={() => {
									let url = `${SERVER_IP}receipt/${row._id}?orgId=${globalRedux.selectedOrganization._id}`;
									dispatch(deleteApi('DELETE_RECEIPT', url));
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_RECEIPTS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	return (
		<ReceiptListPresentational
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
				refreshList: getReceipts,
				tableLoading,
				rowSelection,
				users,
				state,
				setState,
			}}
		/>
	);
});

export default ReceiptListFunctional;
