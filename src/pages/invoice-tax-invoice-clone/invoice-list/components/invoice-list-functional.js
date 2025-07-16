import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Row, Col } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';

import { SERVER_IP } from 'assets/Config';
import { downloadFileFromURL } from 'helpers';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { ACTIONS, API_STATUS, DATE_FORMAT } from 'constants/app-constants';

import HighlightComponent from 'components/HighlightComponent';
import InvoiceListPresentational from './invoice-list-presentational';
import InvoiceToPrint from './invoice-to-print';
import PdfViewerModal from 'components/pdf-viewer-modal';

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 15, 20];

const InvoiceListFunctional = React.memo(() => {
	const dispatch = useDispatch();
	const componentRef = useRef();

	const { selectedOrganization, apiStatus } = useSelector((state) => state.globalRedux);
	const invoices = useSelector((state) => state.invoicesRedux.invoices);

	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);

	// Fetch invoices
	const getInvoices = useCallback(() => {
		dispatch(getApi(ACTIONS.GET_INVOICES, `${SERVER_IP}retail?orgId=${selectedOrganization._id}`));
	}, [dispatch, selectedOrganization._id]);

	useEffect(() => {
		getInvoices();
	}, [getInvoices]);

	useEffect(() => {
		if (apiStatus.DELETE_INVOICE === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_INVOICE'));
			setSelectedRowKeys([]);
			getInvoices();
		}
	}, [apiStatus, dispatch, getInvoices]);

	useEffect(() => {
		setTableData(invoices);
	}, [invoices]);

	const filteredData = useMemo(() => {
		if (!searchKey) return tableData;
		return tableData.filter((record) =>
			[record?.customerId?.displayName, moment(record?.invoiceDate).format(DATE_FORMAT.DD_MM_YYYY), moment(record?.dueDate).format(DATE_FORMAT.DD_MM_YYYY)].some((field) => (field || '').toLowerCase().includes(searchKey.toLowerCase()))
		);
	}, [tableData, searchKey]);

	const column = useMemo(
		() => [
			{
				title: '#',
				dataIndex: 'invoiceNumber',
				align: 'center',
				width: '5%',
				render: (value) => highlight(value),
			},
			{
				title: 'Customer Name',
				dataIndex: 'customerId',
				width: '10%',
				render: (value) => highlight(value?.displayName),
			},
			{
				title: 'Invoice Date',
				dataIndex: 'invoiceDate',
				width: '8%',
				render: (value) => highlight(moment(value).format(DATE_FORMAT.DD_MM_YYYY)),
			},
			{
				title: 'Due Date',
				dataIndex: 'dueDate',
				width: '8%',
				render: (value) => highlight(moment(value).format(DATE_FORMAT.DD_MM_YYYY)),
			},
			{
				title: 'Shipping Charges',
				dataIndex: 'shippingCharges',
				width: '10%',
				align: 'right',
				render: (value) => highlight((+value || 0).toFixed(2)),
			},
			{
				title: 'Inv Amount',
				dataIndex: 'totalAmount',
				width: '8%',
				align: 'right',
				render: (value) => highlight((+value).toFixed(2)),
			},
			{
				title: 'Balance Due',
				dataIndex: 'totalAmount',
				width: '8%',
				align: 'right',
				render: (value) => highlight((+value).toFixed(2)),
			},
			{
				title: 'Status',
				dataIndex: 'status',
				width: '10%',
				align: 'center',
				render: (value) => highlight(value),
			},
			{
				title: 'File',
				dataIndex: '_id',
				key: '_id',
				width: '8%',
				align: 'center',
				render: (value) => (
					<Row justify="center">
						<Col
							className="edit_icon"
							onClick={(e) => {
								e.stopPropagation();
								setSelectedFile(value);
							}}>
							<EyeOutlined />
						</Col>
						<Col>
							<div
								onClick={(e) => {
									e.stopPropagation();
									downloadFileFromURL(`${SERVER_IP}/invoice/download/${value}?orgId=${selectedOrganization._id}`);
								}}>
								<Col className="edit_icon">
									<DownloadOutlined />
								</Col>
							</div>
						</Col>
					</Row>
				),
			},
		],
		[searchKey]
	);

	const highlight = (text) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape textToHighlight={text?.toString() || ''} />;

	const tableLoading = useMemo(() => apiStatus.GET_INVOICES === API_STATUS.PENDING, [apiStatus]);

	const handleTableChange = (page, size) => {
		setCurrentPage(page);
		setPageSize(size);
	};

	const getStartingValue = () => (currentPage - 1) * pageSize + 1;
	const getEndingValue = () => Math.min(currentPage * pageSize, tableData.length);

	const rowSelection = {
		selectedRowKeys,
		onChange: setSelectedRowKeys,
		columnWidth: '5%',
	};

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: 'Invoice',
		onAfterPrint: () => setSelectedRecordToPrint(null),
		removeAfterPrint: true,
	});

	useEffect(() => {
		if (selectedRecordToPrint) {
			handlePrint();
		}
	}, [selectedRecordToPrint]);

	return (
		<>
			<div style={{ display: 'none' }}>
				<InvoiceToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>
			<InvoiceListPresentational
				column={column}
				filteredData={filteredData}
				handleTableChange={handleTableChange}
				getStartingValue={getStartingValue}
				getEndingValue={getEndingValue}
				pageSize={pageSize}
				intialPageSizeOptions={PAGE_SIZE_OPTIONS}
				initialPageSize={PAGE_SIZE}
				currentPage={currentPage}
				setSearchKey={setSearchKey}
				refreshList={getInvoices}
				tableLoading={tableLoading}
				rowSelection={rowSelection}
				selectedInvoice={selectedInvoice}
				setSelectedInvoice={setSelectedInvoice}
				setSelectedRecordToPrint={setSelectedRecordToPrint}
				selectedRowKeys={selectedRowKeys}
				selectedFile={selectedFile}
				setSelectedFile={setSelectedFile}
			/>
			<PdfViewerModal selectedFile={selectedFile} open={!!selectedFile} onClose={() => setSelectedFile(null)} url={selectedFile} />
		</>
	);
});

export default InvoiceListFunctional;
