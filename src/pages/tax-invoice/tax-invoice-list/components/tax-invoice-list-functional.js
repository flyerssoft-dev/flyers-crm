import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Row, Col, Dropdown, Tooltip, Tag, Modal } from 'antd';
import { EyeOutlined, DownloadOutlined, MoreOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';

import { SERVER_IP } from 'assets/Config';
import { ACTIONS, API_STATUS, DATE_FORMAT, INVOICE_STATUS, NOTIFICATION_STATUS_TYPES, STATUS } from 'constants/app-constants';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { downloadFileFromURL, showToast } from 'helpers';
import { sendPostRequest } from 'redux/sagas/utils';

import HighlightComponent from 'components/HighlightComponent';
import PdfViewerModal from 'components/pdf-viewer-modal';
import InvoiceToPrint from './tax-invoice-to-print';
import TaxInvoiceListPresentational from './tax-invoice-list-presentational';

const PAGE_SIZE_OPTIONS = [10, 15, 20];
const DEFAULT_PAGE_SIZE = 10;

const TaxInvoiceListFunctional = () => {
	const dispatch = useDispatch();
	const componentRef = useRef();
	const navigate = useNavigate();

	const globalRedux = useSelector((state) => state?.globalRedux);
	const taxInvoices = useSelector((state) => state?.taxInvoicesRedux?.taxInvoices);

	const [searchKey, setSearchKey] = useState('');
	const [filteredData, setFilteredData] = useState([]);
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
	const [pageLoader, setPageLoader] = useState({ type: null, generating: false });

	const fetchInvoices = useCallback(() => {
		setSelectedRowKeys([]);
		dispatch(getApi(ACTIONS.GET_TAX_INVOICES, `${SERVER_IP}invoice?orgId=${globalRedux.selectedOrganization._id}&invoiceType=tax_invoice`));
	}, [dispatch, globalRedux.selectedOrganization._id]);
	const enableEinvoice = globalRedux.selectedOrganization?.enableEinvoice;

	const generateEInvoice = useCallback(
		async (invoiceId) => {
			try {
				setPageLoader({ type: 'einvoice', generating: true });
				const response = await sendPostRequest({
					url: `${SERVER_IP}invoice/einvoice`,
					body: { invoiceId, orgId: globalRedux.selectedOrganization._id },
				});
				if (response?.data?.data?.success) {
					showToast('Success!', 'E-Invoice generated successfully', NOTIFICATION_STATUS_TYPES.SUCCESS);
					fetchInvoices();
				} else {
					showToast('Failed!', response?.error?.response?.data?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
				}
			} catch (error) {
				showToast('Failed!', error?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
			} finally {
				setPageLoader({ type: 'einvoice', generating: false });
			}
		},
		[globalRedux.selectedOrganization._id, fetchInvoices]
	);

	const cancelInvoice = useCallback(
		async (invoiceId) => {
			try {
				setPageLoader({ type: 'cancel_einvoice', generating: true });
				const response = await sendPostRequest({
					url: `${SERVER_IP}invoice/cancel-einvoice`,
					body: { invoiceId, orgId: globalRedux.selectedOrganization._id },
				});
				if (response?.data?.data?.success) {
					showToast('Success!', 'Invoice canceled successfully', NOTIFICATION_STATUS_TYPES.SUCCESS);
					fetchInvoices();
				} else {
					showToast('Failed!', response?.error?.response?.data?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
				}
			} catch (error) {
				showToast('Failed!', error?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
			} finally {
				setPageLoader({ type: 'cancel_einvoice', generating: false });
			}
		},
		[globalRedux.selectedOrganization._id, fetchInvoices]
	);

	const generateEWayBill = useCallback(
		async (invoiceId) => {
			try {
				setPageLoader({ type: 'ewaybill', generating: true });
				const response = await sendPostRequest({
					url: `${SERVER_IP}invoice/ewaybill`,
					body: { invoiceId, orgId: globalRedux.selectedOrganization._id },
				});
				if (response?.data?.data?.success) {
					showToast('Success!', 'E-Way Bill generated successfully', NOTIFICATION_STATUS_TYPES.SUCCESS);
					fetchInvoices();
				} else {
					showToast('Failed!', response?.error?.response?.data?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
				}
			} catch (error) {
				showToast('Failed!', error?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
			} finally {
				setPageLoader({ type: 'ewaybill', generating: false });
			}
		},
		[globalRedux.selectedOrganization._id, fetchInvoices]
	);

	const cancelEWayBill = useCallback(
		async (invoiceId) => {
			try {
				setPageLoader({ type: 'cancel_ewaybill', generating: true });
				const response = await sendPostRequest({
					url: `${SERVER_IP}invoice/cancel-ewaybill`,
					body: { invoiceId, orgId: globalRedux.selectedOrganization._id },
				});
				if (response?.data?.data?.success) {
					showToast('Success!', 'E-Way Bill canceled successfully', NOTIFICATION_STATUS_TYPES.SUCCESS);
					fetchInvoices();
				} else {
					showToast('Failed!', response?.error?.response?.data?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
				}
			} catch (error) {
				showToast('Failed!', error?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
			} finally {
				setPageLoader({ type: 'cancel_ewaybill', generating: false });
			}
		},
		[globalRedux.selectedOrganization._id, fetchInvoices]
	);

	useEffect(() => {
		fetchInvoices();
	}, [fetchInvoices]);

	useEffect(() => {
		if (globalRedux.apiStatus.DELETE_TAX_INVOICE === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_TAX_INVOICE'));
			setSelectedRowKeys([]);
			fetchInvoices();
		}
	}, [globalRedux.apiStatus, dispatch, fetchInvoices]);

	useEffect(() => {
		setFilteredData(
			!searchKey
				? taxInvoices
				: taxInvoices?.filter((record) => {
						const name = record?.customerId?.displayName || '';
						const invoiceNumber = record?.invoiceNumber?.toString() || '';
						const invoiceDate = moment(record?.invoiceDate).format(DATE_FORMAT.DD_MM_YYYY);
						const dueDate = moment(record?.dueDate).format(DATE_FORMAT.DD_MM_YYYY);
						const totalAmount = record?.totalAmount?.toString() || '';
						const status = record?.invoiceStatus || '';
						const einvoiceStatus = record?.einvoiceStatus || '';
						const ewaybillStatus = record?.ewaybillStatus || '';

						return [name, invoiceNumber, invoiceDate, dueDate, totalAmount, status, einvoiceStatus, ewaybillStatus].some((field) => field.toLowerCase().includes(searchKey.toLowerCase()));
				  })
		);
	}, [searchKey, taxInvoices]);

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: 'Tax Invoice',
		removeAfterPrint: true,
		onAfterPrint: () => setSelectedRecordToPrint(null),
	});

	useEffect(() => {
		if (selectedRecordToPrint) handlePrint();
	}, [selectedRecordToPrint]);

	const columns = useMemo(() => {
		const highlight = (text) => <HighlightComponent searchWords={[searchKey]} autoEscape textToHighlight={text?.toString() || ''} />;

		return [
			{ title: '#', dataIndex: 'invoiceNumber', align: 'center', width: '5%', render: highlight },
			{ title: 'Customer Name', dataIndex: 'customerId', width: '10%', render: (val) => highlight(val?.displayName) },
			{ title: 'Invoice Date', dataIndex: 'invoiceDate', width: '8%', render: (val) => highlight(moment(val).format(DATE_FORMAT.DD_MM_YYYY)) },
			{ title: 'Due Date', dataIndex: 'dueDate', width: '8%', render: (val) => highlight(moment(val).format(DATE_FORMAT.DD_MM_YYYY)) },
			{ title: 'E-Invoice', dataIndex: 'einvoiceStatus', width: '10%', align: 'right', render: (val) => <Tag color={STATUS[val]}>{val}</Tag> },
			{ title: 'E-Way Bill', dataIndex: 'ewaybillStatus', width: '10%', align: 'right', render: (val) => <Tag color={STATUS[val]}>{val}</Tag> },
			{ title: 'Inv Amt.', dataIndex: 'totalAmount', width: '8%', align: 'right', render: (val) => highlight(parseFloat(val)?.toFixed(2)) },
			{ title: 'Balance', dataIndex: 'totalAmount', width: '8%', align: 'right', render: (val) => highlight(parseFloat(val)?.toFixed(2)) },
			{
				title: 'Status',
				dataIndex: 'invoiceStatus',
				align: 'center',
				width: '8%',
				sorter: (a, b) => a?.invoiceStatus?.localeCompare(b?.invoiceStatus),
				render: (val) => <Tag color={STATUS[val]}>{val}</Tag>,
			},
			{
				title: 'Action',
				align: 'center',
				dataIndex: 'invoiceNumber',
				width: '10%',
				render: (_, row) => (
					<Row gutter={10} justify="center">
						<Col>
							<Dropdown
								menu={{
									items: [
										{
											key: 'view',
											label: (
												<Tooltip title="View Invoice">
													<EyeOutlined /> View Invoice
												</Tooltip>
											),
											onClick: () => setSelectedFile(row),
										},
										{
											key: 'edit',
											label: (
												<Tooltip title="Edit Invoice">
													<EditOutlined /> Edit Invoice
												</Tooltip>
											),
											onClick: () => navigate(`/tax-invoice/${row._id}`),
										},
										...(row?.einvoiceStatus === INVOICE_STATUS.Pending && enableEinvoice
											? [
													{
														key: 'genEinv',
														label: (
															<Tooltip title="Generate E-Invoice">
																<DownloadOutlined /> Generate E-Invoice
															</Tooltip>
														),
														onClick: () => generateEInvoice(row._id),
													},
											  ]
											: []),
										...(row?.einvoiceStatus === INVOICE_STATUS.Generated && row?.ewaybillStatus === INVOICE_STATUS.Pending && enableEinvoice
											? [
													{
														key: 'genEway',
														label: (
															<Tooltip title="Generate E-Way Bill">
																<DownloadOutlined /> Generate E-Way Bill
															</Tooltip>
														),
														onClick: () => generateEWayBill(row._id),
													},
											  ]
											: []),
										...(row?.einvoiceStatus === INVOICE_STATUS.Generated && enableEinvoice
											? [
													{
														key: 'cancelEinv',
														label: (
															<Tooltip title="Cancel Invoice">
																<DeleteOutlined style={{ color: 'red' }} /> <span style={{ color: 'red' }}>Cancel Invoice</span>
															</Tooltip>
														),
														onClick: () =>
															Modal.confirm({
																title: 'Cancel E-Invoice?',
																content: 'This will cancel the generated E-Invoice.',
																okText: 'Yes, Cancel',
																okType: 'danger',
																cancelText: 'No',
																onOk: () => cancelInvoice(row._id),
															}),
													},
											  ]
											: []),
										...(row?.ewaybillStatus === INVOICE_STATUS.Generated && enableEinvoice
											? [
													{
														key: 'cancelEway',
														label: (
															<Tooltip title="Cancel E-Way Bill">
																<DeleteOutlined style={{ color: '#dc3545' }} /> <span style={{ color: '#dc3545' }}>Cancel E-Way Bill</span>
															</Tooltip>
														),
														onClick: () =>
															Modal.confirm({
																title: 'Cancel E-Way Bill?',
																content: 'This will cancel the generated E-Way Bill.',
																okText: 'Yes, Cancel',
																okType: 'danger',
																cancelText: 'No',
																onOk: () => cancelEWayBill(row._id),
															}),
													},
											  ]
											: []),
									],
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<MoreOutlined />
								</a>
							</Dropdown>
						</Col>
					</Row>
				),
			},
		];
	}, [searchKey, navigate, generateEInvoice, cancelInvoice, generateEWayBill, cancelEWayBill]);

	const rowSelection = {
		selectedRowKeys,
		onChange: setSelectedRowKeys,
		columnWidth: '5%',
	};

	const selectedInvoiceData = useMemo(() => {
		if (!selectedRowKeys?.[0]) return null;
		const invoice = filteredData.find((inv) => inv._id === selectedRowKeys?.[0]);
		if (!invoice) return null;
		return {
			einvoiceStatus: invoice.einvoiceStatus,
			ewaybillStatus: invoice.ewaybillStatus,
		};
	}, [selectedRowKeys, filteredData]);

	return (
		<>
			<div style={{ display: 'none' }}>
				<InvoiceToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>

			<TaxInvoiceListPresentational
				column={columns}
				filteredData={filteredData}
				handleTableChange={(cur, size) => {
					setCurrentPage(cur || 1);
					setPageSize(size);
				}}
				getStartingValue={() => (currentPage - 1) * pageSize + 1}
				getEndingValue={() => Math.min(currentPage * pageSize, filteredData.length)}
				pageSize={pageSize}
				intialPageSizeOptions={PAGE_SIZE_OPTIONS}
				initialPageSize={DEFAULT_PAGE_SIZE}
				currentPage={currentPage}
				setSearchKey={setSearchKey}
				refreshList={fetchInvoices}
				tableLoading={globalRedux.apiStatus.GET_TAX_INVOICES === API_STATUS.PENDING}
				rowSelection={rowSelection}
				selectedInvoice={selectedInvoice}
				setSelectedInvoice={setSelectedInvoice}
				setSelectedRecordToPrint={setSelectedRecordToPrint}
				selectedRowKeys={selectedRowKeys}
				selectedFile={selectedFile}
				setSelectedFile={setSelectedFile}
				generateEInvoice={generateEInvoice}
				generateEWayBill={generateEWayBill}
				selectedInvoiceData={selectedInvoiceData}
				pageLoader={pageLoader}
				enableEinvoice={enableEinvoice}
			/>

			<PdfViewerModal selectedFile={selectedFile} open={!!selectedFile} onClose={() => setSelectedFile(null)} url={selectedFile} />
		</>
	);
};

export default TaxInvoiceListFunctional;
