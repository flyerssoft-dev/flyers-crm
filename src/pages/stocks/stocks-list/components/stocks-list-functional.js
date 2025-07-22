import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, STATUS } from 'constants/app-constants';
import ComponentToPrint from 'components/component-to-print';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import StocksListPresentational from './stocks-list-presenatational';
import { Tag } from 'antd';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const StocksListFunctional = React.memo(() => {
	const stocks = useSelector((state) => state?.stocksRedux?.stocks);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [state, setState] = useState({
		visible: false,
	});
	const componentRef = React.useRef();
	const [searchKey, setSearchKey] = useState('');
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedViewRow, setSelectedViewRow] = useState(null);
	const [tableData, setTableData] = useState(stocks);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [stockType, setStockType] = useState('STOCK');
	const dispatch = useDispatch();

	const isStock = stockType === 'STOCK';

	const getStocks = useCallback(() => {
		dispatch(
			getApi(
				ACTIONS.GET_STOCKS,
				isStock
					? `${SERVER_IP}item?orgId=${globalRedux?.selectedOrganization?.id}`
					: `${SERVER_IP}stock?orgId=${globalRedux?.selectedOrganization?.id}`
			)
		);
	}, [dispatch, globalRedux?.selectedOrganization?.id, isStock]);

	const filteredData = useMemo(() => {
		if (!searchKey) return tableData;
	
		const lowerSearchKey = searchKey.toLowerCase();
	
		return tableData.filter((item) => {
			if (isStock) {
				// Filtering logic for STOCK type
				const itemNumber = item?.itemNumber?.toString() || '';
				const itemName = item?.itemName || '';
				const itemCode = item?.itemCode || '';
				const hsnSac = item?.hsnSac || '';
				const unitName = item?.unitId?.unitName || '';
				const status = item?.status || '';
	
				return (
					itemNumber?.toString().toLowerCase().includes(lowerSearchKey) ||
					itemName.toLowerCase().includes(lowerSearchKey) ||
					itemCode.toLowerCase().includes(lowerSearchKey) ||
					hsnSac.toLowerCase().includes(lowerSearchKey) ||
					unitName.toLowerCase().includes(lowerSearchKey) ||
					status.toLowerCase().includes(lowerSearchKey)
				);
			} else {
				// Filtering logic for SERIAL type
				const itemNumber = item?.itemId?.itemNumber?.toString() || '';
				const itemName = item?.itemId?.itemName || '';
				const itemCode = item?.itemId?.itemCode || '';
				const serial = item?.serial || '';
				const billNumber = item?.purchaseId?.billNumber || '';
				const purchaseValue = item?.totalAmount?.toString() || '';
				const status = item?.status || '';
	
				return (
					itemNumber?.toString().toLowerCase().includes(lowerSearchKey) ||
					itemName.toLowerCase().includes(lowerSearchKey) ||
					itemCode.toLowerCase().includes(lowerSearchKey) ||
					serial.toLowerCase().includes(lowerSearchKey) ||
					billNumber.toLowerCase().includes(lowerSearchKey) ||
					purchaseValue?.toString().toLowerCase().includes(lowerSearchKey) ||
					status.toLowerCase().includes(lowerSearchKey)
				);
			}
		});
	}, [tableData, searchKey, isStock]);	

	const stockColumn = [
		{
			title: 'Item Name',
			dataIndex: 'itemName',
			key: 'itemName',
			sorter: (a, b) => a?.itemName?.localeCompare(b?.itemName),
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
			width: '20%',
		},
		{
			title: 'Item/Barcode',
			dataIndex: 'itemCode',
			sorter: (a, b) => a.itemCode?.localeCompare(b.itemCode),
			align: 'left',
			width: '20%',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'HsnSac',
			dataIndex: 'hsnSac',
			align: 'left',
			width: '15%',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'Unit',
			dataIndex: 'unitId',
			align: 'left',
			render: (value) => value?.unitName,
			width: '20%',
		},
		{
			title: 'Current Stock',
			dataIndex: 'currentStock',
			width: '20%',
		},
	];
	const serialColumn = [
		{
			title: 'Item #',
			dataIndex: 'itemId',
			key: 'sno',
			width: '5%',
			render: (value, record, index) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.itemNumber?.toString() || ''}
				/>
			),
		},
		{
			title: 'Item Name',
			dataIndex: 'itemId',
			key: 'itemId',
			sorter: (a, b) => a?.itemId?.itemName?.localeCompare(b?.itemId?.itemName),
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.itemName || ''}
				/>
			),
			width: '10%',
		},
		{
			title: 'Item/Barcode',
			dataIndex: 'itemId',
			sorter: (a, b) => a.itemId?.itemCode?.localeCompare(b.itemId?.itemCode),
			align: 'left',
			width: '10%',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.itemCode || ''}
				/>
			),
		},
		{
			title: 'Serial No',
			dataIndex: 'serial',
			width: '10%',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			),
		},
		{
			title: 'Bill No',
			dataIndex: 'purchaseId',
			width: '10%',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.billNumber || ''}
				/>
			),
		},
		{
			title: 'Bill Date',
			dataIndex: 'purchaseId',
			width: '10%',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.billNumber || ''}
				/>
			),
		},
		{
			title: 'Purchase Value',
			dataIndex: 'totalAmount',
			width: '10%',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.totalAmount?.toString() || ''}
				/>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			width: '10%',
			render: (value) => (value ? <Tag color={STATUS[value]}>{value}</Tag> : null),
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
		getStocks();
	}, [getStocks, stockType]);

	useEffect(() => {
		setTableData(stocks);
	}, [stocks]);

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
		if (globalRedux.apiStatus.DELETE_ORDER === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_ORDER'));
			doIt = true;
		}
		if (doIt) {
			getStocks();
		}
	}, [globalRedux.apiStatus, getStocks, dispatch]);

	useEffect(() => {
		!state?.visible && setSelectedRow(null);
	}, [state?.visible]);

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_STOCKS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<div style={{ display: 'none' }}>
				<ComponentToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>
			<StocksListPresentational
				{...{
					column: isStock ? stockColumn : serialColumn,
					filteredData,
					handleTableChange,
					getStartingValue,
					getEndingValue,
					pageSize,
					intialPageSizeOptions,
					initialPageSize,
					currentPage,
					refreshList: getStocks,
					tableLoading,
					state,
					setState,
					editData: selectedRow,
					setSearchKey,
					rowSelection,
					selectedRowKeys,
					selectedViewRow,
					setSelectedViewRow,
					stockType,
					setStockType,
				}}
			/>
		</>
	);
});

export default StocksListFunctional;
