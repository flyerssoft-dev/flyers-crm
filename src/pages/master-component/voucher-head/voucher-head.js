import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popconfirm, Button, Pagination, Row, Col, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import { API_STATUS } from 'constants/app-constants';
import { generatePagination } from 'helpers';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import { getDateFormat } from 'services/Utils';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import HighlightComponent from 'components/HighlightComponent';
import AddDrawer from 'components/drawer-component';
import AddVoucherHead from './add-voucher-head';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const VoucherHead = React.memo((props) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	const [voucherHeadModal, setVoucherHeadModal] = useState(false);
	console.log('🚀 ~ VoucherHead ~ voucherHeadModal:', voucherHeadModal);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(globalRedux?.vouchers);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [editVoucherHead, setEditVoucher] = useState(null);

	const getVoucherHeads = useCallback(() => {
		let url = `${SERVER_IP}voucherhead/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_VOUCHERS_HEAD', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const handleDrawer = (rowData) => {
		setEditVoucher(rowData);
		setVoucherHeadModal(true);
	};
	const handleAddVoucher = () => {
		setVoucherHeadModal(true);
		setEditVoucher(null);
	};

	useEffect(() => {
		getVoucherHeads();
	}, [getVoucherHeads]);

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
			getVoucherHeads();
		}
	}, [globalRedux.apiStatus, getVoucherHeads, dispatch]);

	useEffect(() => {
		setTableData(globalRedux?.vouchers);
	}, [globalRedux?.vouchers]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((voucher) => {
			return (
				(voucher?.voucherheadName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(voucher?.voucherheadNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(voucher?.openingBalance || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(voucher?.closingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(voucher?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const column = [
		// {
		// 	title: 'Voucher Type',
		// 	dataIndex: 'voucherType',
		// 	key: 'voucherType',
		// 	// sorter: (a, b) => a.displayName.localeCompare(b.displayName),
		// 	fixed: 'left',
		// 	render: (value) => (
		// 		<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
		// 	),
		// },
		{
			title: 'Voucher Name',
			dataIndex: 'voucherheadName',
			key: 'voucherheadName',
			sorter: (a, b) => a.voucherheadName.localeCompare(b.voucherheadName),
			// sorter: (a, b) => a.displayName.localeCompare(b.displayName),
			fixed: 'left',
			render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Opening Balance',
			dataIndex: 'openingBalance',
			sorter: (a, b) => a?.openingBalance - b?.openingBalance,
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.toString()} />,
		},
		{
			title: 'Closing Balance',
			dataIndex: 'closingBalance',
			sorter: (a, b) => a?.closingBalance - b?.closingBalance,
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.toString()} />,
		},
		{
			title: 'Remarks',
			dataIndex: 'remarks',
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			align: 'left',
			// sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			render: (value) => getDateFormat(value),
		},
		{
			title: 'Created By',
			dataIndex: 'createdBy',
			align: 'left',
			render: (value) => `${value?.firstName} ${value?.lastName}`,
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'voucherheadName',
			render: (value, row, index) => {
				return (
					<Row gutter={10} justify="center">
						<Col onClick={() => handleDrawer(row)} className="edit_icon">
							<EditOutlined />
						</Col>
						<Col className="delete_icon">
							<Popconfirm
								title={`Are You Sure to Delete ${value}?`}
								okText="Delete"
								cancelText="No"
								onConfirm={() => {
									let url = `${SERVER_IP}voucherhead/${row._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
									dispatch(deleteApi('DELETE_VOUCHER', url));
								}}
								placement="rightTop">
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

	const handleClose = () => {
		setVoucherHeadModal(false);
		setEditVoucher(null);
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

	const tableLoading = globalRedux.apiStatus.GET_VOUCHERS_HEAD === API_STATUS.PENDING;

	return (
		<>
			<Row>
				<Col xl={24}>
					<TableComponent
						className="custom-table"
						style={{ width: '100%' }}
						columns={column}
						bordered
						rowKey={(record) => record._id}
						dataSource={filteredData}
						loading={tableLoading}
						title={() => (
							<Row style={{ justifyContent: 'space-between' }}>
								<Col md={3}>
									<Input placeholder="Search" suffix={<AiOutlineSearch />} style={{ height: '30px' }} onChange={({ target: { value } }) => setSearchKey(value)} />
								</Col>
								<Col md={7}></Col>
								<Col>
									<Button type="primary" style={{ width: '100%' }} onClick={handleAddVoucher}>
										Add Voucher head
									</Button>
								</Col>
							</Row>
						)}
						pagination={{
							pageSize: pageSize,
							current: currentPage,
							position: ['none', 'none'],
						}}
						footer={() => (
							<Row justify="space-between">
								<Col>
									<div>{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}</div>
								</Col>

								<Col md={8}>
									<div style={{ textAlign: 'right' }}>
										<Pagination current={currentPage} pageSizeOptions={intialPageSizeOptions} defaultPageSize={initialPageSize} showSizeChanger={true} total={filteredData?.length} onChange={handleTableChange} responsive />
									</div>
								</Col>
							</Row>
						)}
						// onChange={handleTableChange}
					/>
				</Col>
			</Row>
			<AddVoucherHead {...{ voucherHeadModal, setVoucherHeadModal, getVoucherHeads, editVoucherHead, handleClose, refreshList: getVoucherHeads }} />
		</>
	);
});

export default VoucherHead;
