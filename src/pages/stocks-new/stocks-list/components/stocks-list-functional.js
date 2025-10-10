import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSelector, useDispatch } from 'react-redux';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
// import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, } from 'constants/app-constants';
import ComponentToPrint from 'components/component-to-print';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import StocksListPresentational from './stocks-list-presenatational';
import { Row, Col, Card } from 'antd';

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
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((item) => {
			return (
				(item?.itemId?.itemName || item?.itemName || '')?.toLowerCase()?.includes(searchKey.toLowerCase()) ||
				(item?.itemId?.itemCode || item?.itemCode || '')?.toLowerCase()?.includes(searchKey.toLowerCase())
			);
			// return (
			// 	(item?.itemId?.itemNumber || item?.itemNumber || '')?.toString()?.toLowerCase()?.includes(searchKey.toLowerCase()) ||
			// 	(item?.itemId?.itemName || item?.itemName || '')?.toLowerCase()?.includes(searchKey.toLowerCase()) ||
			// 	(item?.itemId?.itemCode || item?.itemCode || '')?.toLowerCase()?.includes(searchKey.toLowerCase()) ||
			// 	(item?.itemId?.hsnSac || item?.hsnSac || '')?.toLowerCase()?.includes(searchKey.toLowerCase()) ||
			// 	(item?.itemId?.unitId || item?.unitId?.unitName || '')
			// 		?.toLowerCase()
			// 		.includes(searchKey.toLowerCase())(item?.status || '')
			// 		?.toLowerCase()
			// 		.includes(searchKey.toLowerCase())
			// );
		});
	}, [tableData, searchKey]);

	const stockColumn = [
		{
			title: 'Item Name',
			dataIndex: 'itemName',
			key: 'itemName',
			sorter: (a, b) => a?.itemName?.localeCompare(b?.itemName),
			// render: (value) => (
			// 	<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
			// ),
			// render: (value, record) => (
			// 	<Row>
			// 		<Col span={24}>
			// 			<Card title={value}>
			// 				<Row>
			// 					<Col span={24}>
			// 						<Row justify="space-between">
			// 							<Col>Current stock:</Col>
			// 							<Col>{record?.currentStock}</Col>
			// 						</Row>
			// 					</Col>
			// 				</Row>
			// 			</Card>
			// 		</Col>
			// 	</Row>
			// ),
			render: (value, record) => {
				return {
					props: {
					  style: { background:selectedRow?._id === record?._id ? "rgb(227 239 255)" : "" }
					},
					children: (
						<Row
							onClick={() => handleSelectRow(record)}
							style={{
								cursor: 'pointer',
							}}>
							<Col span={24}>
								<div
									style={{
										// fontSize: '1rem',
										fontWeight: 'bold',
										color: '#66a4f7',
									}}>
									{value}
								</div>
								{record?.itemCode && (
									<div
										style={{
											fontSize: 12,
											fontWeight: 'bold',
										}}>
										{record?.itemCode || ''}
									</div>
								)}
								{/* <Row>
									<Col span={24}>
										<Row justify="space-between">
											<Col>Current stock:</Col>
											<Col>
												<span
													style={{
														fontSize: '1rem',
														fontWeight: 'bold',
													}}>
													{record?.currentStock}
												</span>
											</Col>
										</Row>
									</Col>
								</Row> */}
							</Col>
						</Row>
					)
				}
			},
			width: '70%',
		},
		// {
		// 	title: 'Item/Barcode',
		// 	dataIndex: 'itemCode',
		// 	sorter: (a, b) => a.itemCode?.localeCompare(b.itemCode),
		// 	align: 'left',
		// 	width: '20%',
		// 	render: (value) => (
		// 		<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
		// 	),
		// },
		// {
		// 	title: 'HsnSac',
		// 	dataIndex: 'hsnSac',
		// 	align: 'left',
		// 	width: '15%',
		// 	render: (value) => (
		// 		<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
		// 	),
		// },
		// {
		// 	title: 'Unit',
		// 	dataIndex: 'unitId',
		// 	align: 'left',
		// 	render: (value) => value?.unitName,
		// 	width: '20%',
		// },
		{
			title: 'Stock',
			dataIndex: 'currentStock',
			width: '30%',
			sorter: (a, b) => a?.currentStock - b?.currentStock,
			align: 'center',
			
			render: (value, record) => {
				return {
					props: {
					  style: { background:selectedRow?._id === record?._id ? "rgb(227 239 255)" : "" }
					},
					children: value
				}
			},
		},
	];
	const serialColumn = [
		{
			title: 'Item Name',
			dataIndex: 'itemId',
			key: 'itemId',
			sorter: (a, b) => a?.itemId?.itemName?.localeCompare(b?.itemId?.itemName),
			// render: (value) => (
			// 	<HighlightComponent
			// 		highlightClassName="highlightClass"
			// 		searchWords={[searchKey]}
			// 		autoEscape={true}
			// 		textToHighlight={value?.itemName || ''}
			// 	/>
			// ),
			render: (itemId, record) => (
				<Row>
					<Col>
						<Card title={itemId?.itemName}>{itemId?.itemName}</Card>
					</Col>
				</Row>
			),
			width: '20%',
		},
		// {
		// 	title: 'Item/Barcode',
		// 	dataIndex: 'itemId',
		// 	sorter: (a, b) => a.itemId?.itemCode?.localeCompare(b.itemId?.itemCode),
		// 	align: 'left',
		// 	width: '15%',
		// 	render: (value) => (
		// 		<HighlightComponent
		// 			highlightClassName="highlightClass"
		// 			searchWords={[searchKey]}
		// 			autoEscape={true}
		// 			textToHighlight={value?.itemCode || ''}
		// 		/>
		// 	),
		// },
		// {
		// 	title: 'HsnSac',
		// 	dataIndex: 'itemId',
		// 	align: 'left',
		// 	width: '10%',
		// 	render: (value) => (
		// 		<HighlightComponent
		// 			highlightClassName="highlightClass"
		// 			searchWords={[searchKey]}
		// 			autoEscape={true}
		// 			textToHighlight={value?.hsnSac || ''}
		// 		/>
		// 	),
		// },
		// {
		// 	title: 'Purchase Bill',
		// 	dataIndex: 'purchaseId',
		// 	width: '10%',
		// 	render: (value) => (
		// 		<HighlightComponent
		// 			highlightClassName="highlightClass"
		// 			searchWords={[searchKey]}
		// 			autoEscape={true}
		// 			textToHighlight={value?.billNumber || ''}
		// 		/>
		// 	),
		// },
		// {
		// 	title: 'Serial',
		// 	dataIndex: 'serial',
		// 	width: '10%',
		// 	render: (value) => (
		// 		<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value || ''} />
		// 	),
		// },
		// {
		// 	title: 'Status',
		// 	dataIndex: 'status',
		// 	width: '10%',
		// 	render: (value) => (value ? <Tag color={STATUS[value]}>{value}</Tag> : null),
		// },
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
					selectedRow: selectedRow,
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
