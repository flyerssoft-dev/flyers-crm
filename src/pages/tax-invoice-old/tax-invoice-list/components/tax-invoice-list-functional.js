import React, { useEffect, useMemo, useState, useCallback } from 'react';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import { Tag, Row, Col, Popconfirm } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, DATE_FORMAT, STATUS } from 'constants/app-constants';
import ComponentToPrint from 'components/component-to-print';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { convertToIndianRupees, copyToClipboard } from 'helpers';
import TaxInvoiceListPresentational from './tax-invoice-list-presenatational';

const initialPageSize = 20;
const intialPageSizeOptions = [10, 15, 20];

const useQuery = () => {
	return queryString.parse(useLocation().search);
};

const TaxInvoiceListFunctional = React.memo(() => {
	const query = useQuery();
	const selectedInvoice = query.selectedInvoice;
	// const selectedInvoice = query.get('selectedInvoice');
	console.log('🚀 ~ InvoiceListFunctional ~ selectedInvoice:', selectedInvoice);
	const taxInvoices = useSelector((state) => state?.taxInvoicesRedux?.taxInvoices);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [state, setState] = useState({
		visible: false,
	});
	const componentRef = React.useRef();
	const [searchKey, setSearchKey] = useState('');
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedViewRow, setSelectedViewRow] = useState(null);
	const [tableData, setTableData] = useState(taxInvoices);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const getTaxInvoices = useCallback(() => {
		dispatch(getApi(ACTIONS.GET_TAX_INVOICES, `${SERVER_IP}invoice?orgId=${globalRedux?.selectedOrganization?._id}`));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.invoiceNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.trackingNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.invoiceNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(moment(record?.invoiceDate).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(moment(record?.dueDate).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.status || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(parseFloat(record?.totalAmount)?.toFixed(2) || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.invoiceId?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const column = selectedInvoice
		? [
				{
					title: 'Customer',
					dataIndex: 'customerId',
					key: 'customerId',
					sorter: (a, b) => a?.customerId?.displayName?.localeCompare(b?.customerId?.displayName),
					render: (value, record) => (
						<div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									width: '100%',
								}}>
								<b>{value?.displayName}</b>
								<b>{convertToIndianRupees(record?.totalAmount)}</b>
							</div>
							{/* <div>Balance: {convertToIndianRupees(record?.totalAmount)}</div> */}
						</div>
					),
				},
		  ]
		: [
				{
					title: '#',
					dataIndex: 'invoiceNumber',
					key: 'invoiceNumber',
					sorter: (a, b) => a?.invoiceNumber?.localeCompare(b?.invoiceNumber),
					width: '5%',
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
					width: '15%',
					sorter: (a, b) => a?.customerId?.displayName?.localeCompare(b?.customerId?.displayName),
					render: (value) => (
						<HighlightComponent
							highlightClassName="highlightClass"
							searchWords={[searchKey]}
							autoEscape={true}
							textToHighlight={value?.displayName || ''}
						/>
					),
				},
				{
					title: 'Invoice Date',
					dataIndex: 'invoiceDate',
					key: 'invoiceDate',
					width: '10%',
					sorter: (a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate),
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
					title: 'Tracking #',
					dataIndex: 'trackingNumber',
					key: 'trackingNumber',
					width: '15%',
					sorter: (a, b) => a?.trackingNumber?.localeCompare(b?.trackingNumber),
					render: (value) => (
						<div
							style={{
								textDecoration: 'underline',
								color: '#006fd9',
								cursor: 'pointer',
							}}
							onClick={() => {
								copyToClipboard(value);
							}}>
							<HighlightComponent
								highlightClassName="highlightClass"
								searchWords={[searchKey]}
								autoEscape={true}
								textToHighlight={value || ''}
							/>
						</div>
					),
				},
				{
					title: 'Bill Amount',
					dataIndex: 'totalAmount',
					key: 'totalAmount',
					width: '10%',
					sorter: (a, b) => a?.totalAmount - b?.totalAmount,
					align: 'right',
					render: (value) => (
						<HighlightComponent
							highlightClassName="highlightClass"
							searchWords={[searchKey]}
							autoEscape={true}
							textToHighlight={parseFloat(value)?.toFixed(2)}
						/>
					),
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
					dataIndex: 'invoiceNumber',
					width: '10%',
					render: (value, row) => {
						return (
							<Row gutter={10} justify="center">
								<Col onClick={() => handleSelectRow(row)} className="edit_icon">
									<EditOutlined />
								</Col>
								<Popconfirm
									title={`Are you sure to delete this invoice: ${value}?`}
									okText="Delete"
									cancelText="No"
									placement="rightTop"
									onConfirm={() => {
										let url = `${SERVER_IP}invoice/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
										dispatch(deleteApi('DELETE_TAX_INVOICE', url));
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
		getTaxInvoices();
	}, [getTaxInvoices]);

	useEffect(() => {
		setTableData(taxInvoices);
	}, [taxInvoices]);

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
		if (globalRedux.apiStatus.DELETE_TAX_INVOICE === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_TAX_INVOICE'));
			doIt = true;
		}
		if (doIt) {
			getTaxInvoices();
		}
	}, [globalRedux.apiStatus, getTaxInvoices, dispatch]);

	useEffect(() => {
		!state?.visible && setSelectedRow(null);
	}, [state?.visible]);

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_PURCHASES === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const selectedInvoiceDetails = useMemo(() => {
	if (selectedInvoice) {
			return tableData.find((invoice) => invoice._id === selectedInvoice);
		}
		return null;
	}, [selectedInvoice, tableData]);
	console.log('🚀 ~ selectedInvoiceDetails ~ selectedInvoiceDetails:', selectedInvoiceDetails);

	return (
		<>
			<div style={{ display: 'none' }}>
				<ComponentToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>
			<TaxInvoiceListPresentational
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
					refreshList: getTaxInvoices,
					tableLoading,
					state,
					setState,
					editData: selectedRow,
					setSearchKey,
					rowSelection,
					selectedRowKeys,
					selectedViewRow,
					setSelectedViewRow,
					selectedInvoiceDetails,
				}}
			/>
		</>
	);
});

export default TaxInvoiceListFunctional;
