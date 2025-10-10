import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import {
	DeleteOutlined,
	EditOutlined,
	// PrinterOutlined
} from '@ant-design/icons';
import { Col, Popconfirm, Row } from 'antd';
import { getDateFormat } from 'services/Utils';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import HighlightComponent from 'components/HighlightComponent';
import { ACTIONS, API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import { generatePagination } from 'helpers';
import VoucherListPresentational from './voucher-list-presenatational';
import VoucherToPrint from './voucher-to-print';
import { deleteApi } from 'redux/sagas/deleteApiSaga';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const VoucherListFunctional = React.memo(() => {
	const componentRef = React.useRef();
	const voucherRedux = useSelector((state) => state.voucherRedux);
	const users = useSelector((state) => state?.userRedux?.users);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [visible, toggleVisible] = useState(false);
	const [selectedRecordToPrint, setSelectedRecordToPrint] = useState(null);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(voucherRedux?.vouchers || []);
	const [currentPage, setCurrentPage] = useState(1);
	const [state, setState] = useState({
		selectedRow: null,
		visible: false,
	});
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const getVouchers = useCallback(() => {
		dispatch(getApi(ACTIONS.GET_VOUCHERS, `${SERVER_IP}voucher?orgId=${globalRedux?.selectedOrganization?.id}`));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getVouchers();
	}, [getVouchers]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_VOUCHER === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_VOUCHER'));
			doIt = true;
		}
		if (doIt) {
			getVouchers();
		}
	}, [globalRedux.apiStatus, dispatch, getVouchers]);

	useEffect(() => {
		setTableData(voucherRedux?.vouchers);
		!state?.visible && state?.selectedRow && setState((state) => ({ ...state, selectedRow: null }));
	}, [voucherRedux?.vouchers, state?.visible, state?.selectedRow]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				// (record?.voucherheadId?.voucherheadName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.voucherNumber || '')?.toString()?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
				(record?.categoryId?.categoryName || '')?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
				(record?.subcategoryId?.subcategoryName || '')?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
				(record?.accbookId?.accbookName || '')?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
				(record?.projectId?.projectName || '')?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
				(`${record?.personalUserId?.firstName} ${record?.personalUserId?.lastName}` || '')?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
				// (record?.personalUserId?.lastName || '')?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
				(moment(record?.voucherDate).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
				(record?.transactionType || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.amount || '')?.toString()?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
				(record?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
			// (record?.priority || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
			// (record?.customerName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
			// (record?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase())
		});
	}, [tableData, searchKey]);

	const handleEdit = (rowData) => {
		setState({
			...state,
			selectedRow: rowData,
			visible: true,
		});
	};

	const checkType = (value) => {
		let background = '';
		if (value) {
			if (value === 'Debit') {
				background = 'rgb(255 229 229)';
			}
			if (value === 'Credit') {
				background = '#DEFFDB';
			}
		}

		return background;
	};

	const column = [
		{
			title: '#',
			dataIndex: 'voucherNumber',
			key: 'voucherNumber',
			sorter: (a, b) => a?.voucherNumber - b?.voucherNumber,
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(record?.transactionType),
						},
					},
					children: (
						<HighlightComponent
							highlightClassName="highlightClass"
							searchWords={[searchKey]}
							autoEscape={true}
							textToHighlight={value?.toString()}
						/>
					),
				};
			},
		},
		{
			title: 'Date',
			dataIndex: 'voucherDate',
			key: 'voucherDate',
			sorter: (a, b) => new Date(a.voucherDate) - new Date(b.voucherDate),
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(record?.transactionType),
						},
					},
					children: (
						<HighlightComponent
							highlightClassName="highlightClass"
							searchWords={[searchKey]}
							autoEscape={true}
							textToHighlight={value ? moment(value).format(DATE_FORMAT.DD_MM_YYYY) : ''}
						/>
					),
				};
			},
		},
		{
			title: 'Category',
			dataIndex: 'categoryId',
			key: 'categoryId',
			sorter: (a, b) => a.categoryId?.categoryName.localeCompare(b.categoryId?.categoryName),
			fixed: 'left',
			width: 150,
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(record?.transactionType),
						},
					},
					children: (
						<HighlightComponent
							highlightClassName="highlightClass"
							searchWords={[searchKey]}
							autoEscape={true}
							textToHighlight={value?.categoryName}
						/>
					),
				};
			},
		},
		{
			title: 'Sub Category',
			dataIndex: 'subcategoryId',
			key: 'subcategoryId',
			sorter: (a, b) => a.subcategoryId?.subcategoryName.localeCompare(b.subcategoryId?.subcategoryName),
			fixed: 'left',
			width: 150,
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(record?.transactionType),
						},
					},
					children: (
						<HighlightComponent
							highlightClassName="highlightClass"
							searchWords={[searchKey]}
							autoEscape={true}
							textToHighlight={value?.subcategoryName}
						/>
					),
				};
			},
		},
		{
			title: 'Project Name',
			dataIndex: 'projectId',
			align: 'left',
			sorter: (a, b) => (a.projectId?.projectName || '').localeCompare(b.projectId?.projectName || ''),
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(record?.transactionType),
						},
					},
					children: (
						<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.projectName} />
					),
					// children: <span>{(value?.title) || '-'}</span>,
				};
			},
		},
		{
			title: 'User(Personal)',
			dataIndex: 'personalUserId',
			align: 'left',
			sorter: (a, b) => a.personalUserId?.firstName.localeCompare(b.personalUserId?.firstName),
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(record?.transactionType),
						},
					},
					children: <span>{value ? `${value?.firstName || ''} ${value?.lastName || ''}` : '-'}</span>,
				};
			},
		},
		{
			title: 'Type',
			dataIndex: 'transactionType',
			key: 'transactionType',
			sorter: (a, b) => a?.transactionType?.localeCompare(b?.transactionType),
			fixed: 'left',
			width: 150,
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(value),
						},
					},
					children: (
						<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
					),
				};
			},
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			sorter: (a, b) => a?.amount - b?.amount,
			align: 'right',
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(record?.transactionType),
						},
					},
					children: (
						<HighlightComponent
							highlightClassName="highlightClass"
							searchWords={[searchKey]}
							autoEscape={true}
							textToHighlight={value?.toString()}
						/>
					),
				};
			},
		},
		{
			title: 'Remarks',
			dataIndex: 'remarks',
			key: 'remarks',
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(record?.transactionType),
						},
					},
					children: (
						<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
					),
				};
			},
		},
		// {
		// 	title: 'Created At',
		// 	dataIndex: 'createdAt',
		// 	align: 'left',
		// 	// sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
		// 	render: (value, record) => {
		// 		return {
		// 			props: {
		// 				style: {
		// 					background: checkType(record?.transactionType),
		// 				},
		// 			},
		// 			children: <span>{getDateFormat(value)}</span>,
		// 		};
		// 	},
		// },
		// {
		// 	title: 'Created By',
		// 	dataIndex: 'createdBy',
		// 	align: 'left',
		// 	render: (value, record) => {
		// 		return {
		// 			props: {
		// 				style: {
		// 					background: checkType(record?.transactionType),
		// 				},
		// 			},
		// 			children: <span>{`${value?.firstName} ${value?.lastName}`}</span>,
		// 		};
		// 	},
		// },
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'voucherNumber',
			width: '10%',
			render: (value, record) => {
				return {
					props: {
						style: {
							background: checkType(record?.transactionType),
						},
					},
					children: (
						<Row gutter={10} justify="center">
							<Col onClick={() => handleEdit(record)} className="edit_icon">
								<EditOutlined />
							</Col>
							<Col className="delete_icon">
								<Col style={{ padding: 0 }}>
									<Popconfirm
										title={`Are You Sure to Delete ${value}?`}
										okText="Delete"
										cancelText="No"
										onConfirm={() => {
											let url = `${SERVER_IP}voucher/${record._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
											dispatch(deleteApi('DELETE_VOUCHER', url));
										}}>
										<DeleteOutlined />
									</Popconfirm>
								</Col>
							</Col>
						</Row>
					),
				};
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_VOUCHERS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleAfterPrint = () => {
		setSelectedRecordToPrint(null);
	};

	const reactToPrintContent = React.useCallback(() => {
		return componentRef.current;
	}, []);

	const handlePrint = useReactToPrint({
		content: reactToPrintContent,
		documentTitle: 'Voucher',
		removeAfterPrint: true,
		onAfterPrint: handleAfterPrint,
		// onBeforeGetContent: handleOnBeforeGetContent,
	});

	useEffect(() => {
		selectedRecordToPrint && handlePrint();
	}, [selectedRecordToPrint, handlePrint]);

	return (
		<>
			<div style={{ display: 'none' }}>
				<VoucherToPrint ref={componentRef} data={selectedRecordToPrint} />
			</div>
			<VoucherListPresentational
				{...{
					searchKey,
					setSearchKey,
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
					refreshList: getVouchers,
					tableLoading,
					rowSelection,
					users,
					state,
					setState,
				}}
			/>
		</>
	);
});

export default VoucherListFunctional;
