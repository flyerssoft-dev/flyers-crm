import React, { useState, useEffect, useMemo, useCallback } from 'react';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import { Tag, Tooltip, Row, Col, Dropdown } from 'antd';
import { DownloadOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, DATE_FORMAT, STATUS } from 'constants/app-constants';
import ComponentToPrint from 'components/component-to-print';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import InvoiceListPresentational from './invoice-list-presentational';
import { downloadFileFromURL, formatToIndianRupees } from 'helpers';
import PdfViewerModal from 'components/pdf-viewer-modal';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const InvoiceListFunctional = React.memo(() => {
	const invoices = useSelector((state) => state?.invoicesRedux?.invoices);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [state, setState] = useState({ visible: false });
	const componentRef = React.useRef();
	const [searchKey, setSearchKey] = useState('');
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedViewRow, setSelectedViewRow] = useState(null);
	const [tableData, setTableData] = useState(invoices);
	const [selectedFile, setSelectedFile] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const getInvoices = useCallback(() => {
		dispatch(getApi(ACTIONS.GET_INVOICES, `${SERVER_IP}invoice?orgId=${globalRedux?.selectedOrganization?.id}&invoiceType=retail_invoice`));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const filteredData = useMemo(() => {
		if (!searchKey) return tableData;

		const loweredSearch = searchKey.toLowerCase();

		return tableData.filter((record) => {
			const invoiceNumber = (record?.invoiceNumber ?? '').toString().toLowerCase();
			const invoiceDate = moment(record?.invoiceDate).format(DATE_FORMAT.DD_MM_YYYY).toLowerCase();
			const dueDate = moment(record?.dueDate).format(DATE_FORMAT.DD_MM_YYYY).toLowerCase();
			const status = (record?.status ?? '').toLowerCase();
			const totalAmount = isFinite(record?.totalAmount) ? record.totalAmount.toFixed(2).toLowerCase() : '';
			const balance = isFinite(record?.balance) ? record.balance.toFixed(2).toLowerCase() : '';
			const customerName = (record?.customerId?.displayName ?? '').toLowerCase();

			return [invoiceNumber, invoiceDate, dueDate, status, totalAmount, balance, customerName].some((field) => field.includes(loweredSearch));
		});
	}, [tableData, searchKey]);

	const handleMenuClick = (e, row) => {
		if (e.key === 'edit') handleSelectRow(row);
		else if (e.key === 'view') handleViewRow(row);
		else if (e.key === 'preview') setSelectedFile(row);
		else if (e.key === 'download') downloadFileFromURL(`${SERVER_IP}/invoice/download/${row?._id}?orgId=${globalRedux.selectedOrganization._id}`);
	};

	const menu = (row) => ({
		items: [
			{
				key: 'view',
				label: (
					<Tooltip title={`View ${row?.items?.length} Item${row?.items?.length > 1 ? 's' : ''}`}>
						<EyeOutlined /> View Items
					</Tooltip>
				),
				onClick: () => handleMenuClick({ key: 'view' }, row),
			},
			{
				key: 'edit',
				label: (
					<>
						<EditOutlined /> Edit Invoice
					</>
				),
				onClick: () => handleMenuClick({ key: 'edit' }, row),
			},
			{
				key: 'preview',
				label: (
					<>
						<EyeOutlined /> Preview Invoice
					</>
				),
				onClick: () => handleMenuClick({ key: 'preview' }, row),
			},
			{
				key: 'download',
				label: (
					<>
						<DownloadOutlined /> Download Invoice
					</>
				),
				onClick: () => handleMenuClick({ key: 'download' }, row),
			},
		],
	});

	const column = [
		{
			title: '#',
			dataIndex: 'invoiceNumber',
			key: 'invoiceNumber',
			width: '5%',
			sorter: (a, b) => a?.invoiceNumber - b?.invoiceNumber,
			align: 'center',
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape textToHighlight={value?.toString()} />,
		},
		{
			title: 'Customer',
			dataIndex: 'customerId',
			key: 'customerId',
			width: '15%',
			sorter: (a, b) => a?.customerId?.displayName?.localeCompare(b?.customerId?.displayName),
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape textToHighlight={value?.displayName || ''} />,
		},
		{
			title: 'Invoice Date',
			dataIndex: 'invoiceDate',
			key: 'invoiceDate',
			width: '10%',
			sorter: (a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate),
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape textToHighlight={moment(value).format(DATE_FORMAT.DD_MM_YYYY)} />,
		},
		{
			title: 'Due Date',
			dataIndex: 'dueDate',
			key: 'dueDate',
			width: '10%',
			sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape textToHighlight={moment(value).format(DATE_FORMAT.DD_MM_YYYY)} />,
		},
		{
			title: 'Total Amt.',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			width: '10%',
			sorter: (a, b) => a?.totalAmount - b?.totalAmount,
			align: 'right',
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape textToHighlight={formatToIndianRupees(value)} />,
		},
		{
			title: 'Balance',
			dataIndex: 'balance',
			key: 'balance',
			width: '10%',
			align: 'right',
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape textToHighlight={formatToIndianRupees(value)} />,
		},
		{
			title: 'Status',
			dataIndex: 'invoiceStatus',
			key: 'invoiceStatus',
			width: '10%',
			align: 'center',
			sorter: (a, b) => a?.invoiceStatus?.localeCompare(b?.invoiceStatus),
			render: (value) => value && <Tag color={STATUS[value]}>{value}</Tag>,
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'invoiceNumber',
			width: '10%',
			render: (value, row) => (
				<Row gutter={10} justify="center">
					<Col>
						<Dropdown menu={menu(row)} trigger={['click']}>
							<a onClick={(e) => e.preventDefault()}>
								<MoreOutlined />
							</a>
						</Dropdown>
					</Col>
				</Row>
			),
		},
	];

	const handleSelectRow = (row) => setSelectedRow(row);
	const handleViewRow = (row) => setSelectedViewRow(row);
	const handleTableChange = (currentPage, pageSize) => {
		setCurrentPage(currentPage || 1);
		setPageSize(pageSize);
	};
	const getStartingValue = () => (currentPage === 1 ? 1 : (currentPage - 1) * pageSize + 1);
	const getEndingValue = () => Math.min(currentPage * pageSize, tableData.length);
	const onSelectChange = (keys) => setSelectedRowKeys(keys);
	const rowSelection = { selectedRowKeys, onChange: onSelectChange, columnWidth: '5%' };
	const handleAfterPrint = () => setSelectedRecordToPrint(null);

	useEffect(() => {
		getInvoices();
	}, [getInvoices]);
	useEffect(() => {
		setTableData(invoices);
	}, [invoices]);

	const reactToPrintContent = useCallback(() => componentRef.current, []);
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
		selectedRow && setState((s) => ({ ...s, visible: true }));
	}, [selectedRow]);
	useEffect(() => {
		if (globalRedux.apiStatus.DELETE_INVOICE === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_INVOICE'));
			getInvoices();
		}
	}, [globalRedux.apiStatus, getInvoices, dispatch]);
	useEffect(() => {
		!state.visible && setSelectedRow(null);
	}, [state.visible]);

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_INVOICES === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<div style={{ display: 'none' }}>
				<ComponentToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>

			<InvoiceListPresentational
				column={column}
				filteredData={filteredData}
				handleTableChange={handleTableChange}
				getStartingValue={getStartingValue}
				getEndingValue={getEndingValue}
				pageSize={pageSize}
				intialPageSizeOptions={intialPageSizeOptions}
				initialPageSize={initialPageSize}
				currentPage={currentPage}
				refreshList={getInvoices}
				tableLoading={tableLoading}
				state={state}
				setState={setState}
				editData={selectedRow}
				setSearchKey={setSearchKey}
				rowSelection={rowSelection}
				selectedRowKeys={selectedRowKeys}
				selectedViewRow={selectedViewRow}
				setSelectedViewRow={setSelectedViewRow}
			/>

			<PdfViewerModal selectedFile={selectedFile} open={!!selectedFile} onClose={() => setSelectedFile(null)} url={selectedFile} />
		</>
	);
});

export default InvoiceListFunctional;
