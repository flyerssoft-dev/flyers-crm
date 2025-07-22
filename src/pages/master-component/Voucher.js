import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popconfirm, Button, Pagination, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import AddDrawer from 'components/drawer-component';
import { generatePagination } from 'helpers';
import { getApi } from '../../redux/sagas/getApiDataSaga';
import { SERVER_IP } from '../../assets/Config';
import { getDateFormat } from '../../services/Utils';
import { deleteApi } from '../../redux/sagas/deleteApiSaga';
import { resetApiStatus } from '../../redux/reducers/globals/globalActions';
import HighlightComponent from '../../components/HighlightComponent';
import { API_STATUS } from 'constants/app-constants';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const Voucher = React.memo((props) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	const [accountBookModal, setAccountBookModal] = useState(false);
	const [searchKey] = useState('');
	const [tableData, setTableData] = useState(globalRedux?.vouchers);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [editVoucher, setEditVoucher] = useState(null);

	const getVouchers = useCallback(() => {
		let url = `${SERVER_IP}voucherhead/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_VOUCHERS_HEAD', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	// const handleDrawer = (rowData) => {
	// 	setEditVoucher(rowData);
	// 	setAccountBookModal(true);
	// };

	const handleAddVoucher = () => {
		setAccountBookModal(true);
		setEditVoucher(null);
	};
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
	}, [globalRedux.apiStatus, getVouchers, dispatch]);

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
			// sorter: (a, b) => a.displayName.localeCompare(b.displayName),
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Projects',
			dataIndex: 'projectIds',
			align: 'left',
			render: (value) => {
				return value?.map((project) => project.title).join(', ');
			},
		},
		{
			title: 'Opening Balance',
			dataIndex: 'openingBalance',
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.toString()} />,
		},
		{
			title: 'Closing Balance',
			dataIndex: 'closingBalance',
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
			align: 'left',
			// sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			render: (value) => getDateFormat(value),
		},
		{
			title: 'Created By',
			dataIndex: 'createdBy',
			align: 'left',
			// sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			render: (value) => value.firstName,
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'voucherheadName',
			render: (value, row, index) => {
				return (
					<Row gutter={10} justify="center">
						{/* <Col onClick={() => handleDrawer(row)} className="edit_icon">
							<EditOutlined />
						</Col> */}
						<Col className="delete_icon">
							<Popconfirm
								title={`Are you sure to Delete ${value}?`}
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

	const loading = useMemo(() => globalRedux.apiStatus.GET_VOUCHERS_HEAD === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<Row style={{ padding: '20px 10px' }}>
				<Col xl={24}>
					<TableComponent
						loading={loading}
						className="custom-table"
						style={{ width: '100%' }}
						columns={column}
						bordered
						rowKey={(record) => record._id}
						dataSource={filteredData}
						title={() => (
							<Row style={{ justifyContent: 'space-between' }}>
								<Col md={3}>
									{/* <Input
										placeholder="Search"
										suffix={<AiOutlineSearch />}
										style={{ height: '30px' }}
										onChange={({ target: { value } }) => setSearchKey(value)}
									/> */}
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
							current: currentPage,
							pageSize: pageSize,
							position: ['none', 'none'],
						}}
						footer={() => (
							<Row justify="space-between">
								<Col>
									<div>
										{!!filteredData?.length &&
											`Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
									</div>
								</Col>

								<Col md={8}>
									<div style={{ textAlign: 'right' }}>
										<Pagination
											pageSizeOptions={intialPageSizeOptions}
											defaultPageSize={initialPageSize}
											showSizeChanger={true}
											total={filteredData?.length}
											onChange={handleTableChange}
											responsive
										/>
									</div>
								</Col>
							</Row>
						)}
						onChange={handleTableChange}
					/>
				</Col>
			</Row>
			<AddDrawer {...{ accountBookModal, setAccountBookModal, getVouchers, editVoucher }} />
		</>
	);
});

export default Voucher;
