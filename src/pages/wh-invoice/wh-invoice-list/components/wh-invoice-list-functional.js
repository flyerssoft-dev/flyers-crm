import React, { useEffect, useMemo, useState, useCallback } from 'react';
import moment from 'moment';
import { Row, Col, Popconfirm, Popover, Button, Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { CloseOutlined, EditOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import WHToPrint from './wh-to-print';
import WHInvoicePresentational from './wh-invoice-list-presenatational';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { AiFillCar } from 'react-icons/ai';
import TransportDetailsToPrint from './transport-to-print';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const WHInvoiceFunctional = React.memo((props) => {
	const [selectedType, setSelectedType] = useState(null);
	const [printoutType, setPrintoutType] = useState(null);
	const invoices = useSelector((state) => state?.whInvoiceRedux?.whInvoices);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [state, setState] = useState({
		visible: false,
		invoiceType: null,
	});
	const componentRef = React.useRef();
	const [searchKey, setSearchKey] = useState('');
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedViewRow, setSelectedViewRow] = useState(null);
	const [tableData, setTableData] = useState(invoices);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const dispatch = useDispatch();

	const PRINTOUT_TYPES = ['Original', 'Duplicate', 'Acknowledgement'];

	const PrintoutButton = ({ recordType = 'WH', row = null }) => (
		<Popover
			placement="left"
			title={<span>Select type</span>}
			content={
				<Row gutter={[10, 10]} style={{ width: 'min-content' }}>
					{PRINTOUT_TYPES?.map((printoutType) => (
						<Col span={24}>
							<Button
								type="primary"
								style={{ width: '100%' }}
								onClick={() => {
									setPrintoutType(printoutType);
									setSelectedType(recordType);
									setSelectedRecordToPrint(row);
								}}>
								{printoutType} Copy
							</Button>
						</Col>
					))}
				</Row>
			}
			trigger="click">
			<Col className="edit_icon">
				<Col style={{ padding: 0 }}>{recordType === 'WH' ? <PrinterOutlined /> : <AiFillCar />}</Col>
			</Col>
		</Popover>
	);

	const getWHInvoices = useCallback(() => {
		dispatch(getApi(ACTIONS.GET_WH_INVOICES, `${SERVER_IP}invoice?orgId=${globalRedux.selectedOrganization._id}`));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.invoiceNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.vendorId?.vendorName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.billingAddress || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.notes || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.poNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_INVOICE === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_INVOICE'));
			doIt = true;
		}
		if (doIt) {
			getWHInvoices();
		}
	}, [globalRedux.apiStatus, dispatch, getWHInvoices]);

	const column = [
		{
			title: 'Invoice No#',
			dataIndex: 'invoiceNumber',
			key: 'invoiceNumber',
			width: '5%',
			sorter: (a, b) => a?.invoiceNumber - b?.invoiceNumber,
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
			title: 'Invoice Date',
			dataIndex: 'invoiceDate',
			key: 'invoiceDate',
			sorter: (a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate),
			width: '10%',
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
			title: 'Vendor Name',
			sorter: (a, b) => a?.vendorId?.vendorName?.localeCompare(b?.vendorId?.vendorName),
			dataIndex: 'vendorId',
			key: 'vendorId',
			width: '15%',
			render: (value) => (
				<HighlightComponent className="bold" searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.vendorName || ''} />
			),
		},
		{
			title: 'Invoice Type',
			dataIndex: 'invoiceType',
			sorter: (a, b) => a?.invoiceType?.localeCompare(b?.invoiceType),
			key: 'invoiceType',
			width: '10%',
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
			title: 'Department',
			dataIndex: 'department',
			key: 'department',
			width: '10%',
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
			title: 'Invoice Amount',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			width: '10%',
			align: 'right',
			render: (value) => parseFloat(value).toFixed(2),
		},
		{
			title: 'Payment Received',
			dataIndex: 'receiptTotal',
			key: 'receiptTotal',
			width: '10%',
			align: 'right',
			render: (value) => parseFloat(value).toFixed(2),
		},
		{
			title: 'Balance Amount',
			dataIndex: 'balanceAmount',
			key: 'balanceAmount',
			width: '10%',
			align: 'right',
			render: (value) => parseFloat(value).toFixed(2),
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'displayName',
			width: '10%',
			render: (value, row) => {
				return (
					<Row gutter={10} justify="end">
						{row?.receiptData?.length > 0 && (
							<Tooltip placement="left" title={'View Receipt Details'}>
								<Col
									onClick={() => {
										handleViewRow(row?.receiptData);
									}}
									className="edit_icon">
									<EyeOutlined />
								</Col>
							</Tooltip>
						)}
						<Col
							onClick={() => {
								setState({
									...state,
									visible: true,
									invoiceType: row?.transportItems?.length ? 'VEHICLE' : 'WH',
								});
								handleSelectRow(row);
							}}
							className="edit_icon">
							<EditOutlined />
						</Col>
						{row?.items?.length ? <PrintoutButton recordType="WH" row={row} /> : null}
						{row?.transportItems?.length ? <PrintoutButton recordType="VEHICLE" row={row} /> : null}
						<Col className="delete_icon">
							<Popconfirm
								title={`Are You Sure to Delete?`}
								okText="Delete"
								cancelText="No"
								placement="rightTop"
								onConfirm={() => {
									let url = `${SERVER_IP}invoice/${row._id}?orgId=${globalRedux.selectedOrganization._id}`;
									dispatch(deleteApi('DELETE_INVOICE', url));
								}}>
								<CloseOutlined />
							</Popconfirm>
						</Col>
					</Row>
				);
			},
		},
	];

	const handleSelectRow = (row) => {
		setSelectedRow(row);
	};

	const handleViewRow = (row) => {
		setSelectedViewRow(row);
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

	const handleAfterPrint = () => {
		setSelectedRecordToPrint(null);
	};

	useEffect(() => {
		getWHInvoices();
	}, [getWHInvoices]);

	useEffect(() => {
		setTableData(invoices);
	}, [invoices]);

	const reactToPrintContent = React.useCallback(() => {
		return componentRef.current;
	}, []);

	const handlePrint = useReactToPrint({
		// content: () => {
		// 	const tableStat = componentRef.current.cloneNode(true);
		// 	const PrintElem = document.createElement('div');
		// 	const header =
		// 		//   `<img src="${logo}" alt="" class="watermark"/>` +
		// 		`<div class="page-footer"><div>Whether liable to pay under RCM No</div>${
		// 			selectedRecordToPrint?.transportItems?.length || 0
		// 		} LR Copies<div></div></div>`;
		// 	PrintElem.innerHTML = header;
		// 	PrintElem.appendChild(tableStat);
		// 	return PrintElem;
		// },
		// pageStyle: `@media print {
		// 	.invoice-pdf {
		// 		height: 100%;
		// 	}
		// }`,
		// pageStyle: `@page {
		// 	size: 210mm 148mm;
		// 	}
		// 	@media print {
		// 	@page {  size: a4 landscape;
		// 		margin: 0mm !important;
		// 	}
		// 	@media all {
		// 					.pagebreak {
		// 					  overflow: visible;
		// 					}
		// 				}
		// 			}
		// 		}`,
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
	}, [selectedRow, setState]);

	useEffect(() => {
		!state?.visible && setSelectedRow(null);
	}, [state?.visible]);

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_WH_INVOICES === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<>
				{selectedType !== 'VEHICLE' ? (
					<div style={{ display: 'none' }}>
						<WHToPrint ref={componentRef} data={selectedRecordToPrint} printoutType={printoutType} />
					</div>
				) : (
					<div style={{ display: 'none' }}>
						<TransportDetailsToPrint ref={componentRef} data={selectedRecordToPrint} printoutType={printoutType} />
					</div>
				)}
			</>
			<WHInvoicePresentational
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
					refreshList: getWHInvoices,
					tableLoading,
					state,
					setState,
					editData: selectedRow,
					setSearchKey,
					selectedViewRow,
					setSelectedViewRow,
				}}
			/>
		</>
	);
});

export default WHInvoiceFunctional;
