import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Popconfirm, Input, Button, Pagination, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import AddDrawer from 'components/drawer-component';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import TableComponent from 'components/table-component';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { generatePagination } from 'helpers';
import { API_STATUS } from 'constants/app-constants';
import { EditOutlined } from '@ant-design/icons';
// import { getDateFormat } from 'services/Utils';
// import moment from 'moment';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const Customer = React.memo((props) => {
	const customerRedux = useSelector((state) => state.customerRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const [customerAddModal, setCustomerAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(customerRedux.customers);
	const [editCustomer, setEditCustomer] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const getCustomers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getCustomers();
	}, [getCustomers]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_CUSTOMER === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_CUSTOMER'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getCustomers();
		}
	}, [globalRedux.apiStatus, dispatch, getCustomers]);

	useEffect(() => {
		setTableData(customerRedux.customers);
	}, [customerRedux.customers]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((customer) => {
			return (
				(customer?.customerNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.email || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.gstTreatment || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.address || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.gstin || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.gstTreatment || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.panCard || '')?.toLowerCase().includes(searchKey.toLowerCase) ||
				// (customer?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
				(customer?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditCustomer(rowData);
		setCustomerAddModal(true);
	};

	const handleAddCustomer = () => {
		setEditCustomer(null);
		setCustomerAddModal(true);
	};

	const column = [
		{
			title: '#',
			dataIndex: 'customerNumber',
			key: 'customerNumber',
			sorter: (a, b) => a?.customerNumber - b?.customerNumber,
			fixed: 'left',
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
			title: 'Customer Name',
			dataIndex: 'displayName',
			key: 'displayName',
			sorter: (a, b) => a?.displayName?.localeCompare(b?.displayName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
				</div>
			),
		},
		{
			title: 'Mobile',
			dataIndex: 'mobile',
			sorter: (a, b) => a?.mobile - b?.mobile,
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			sorter: (a, b) => a?.email?.localeCompare(b?.email),
			align: 'left',
			width: '15%',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'GST Treatment',
			dataIndex: 'gstTreatment',
			sorter: (a, b) => a?.gstTreatment?.localeCompare(b?.gstTreatment),
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'GSTIN',
			dataIndex: 'gstin',
			sorter: (a, b) => a?.gstTreatment?.localeCompare(b?.gstTreatment),
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Balance',
			dataIndex: 'outstandingBalance',
			align: 'right',
			sorter: (a, b) => a?.outstandingBalance - b?.outstandingBalance,
			render: (value) => {
				if (!!value) {
					return <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value.toFixed(2)} />;
				} else {
					return <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={(0).toFixed(2)} />;
				}
			},
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'displayName',
			render: (value, row, index) => {
				return (
					<Row justify="center">
						<Col className="edit_icon" onClick={() => handleDrawer(row)}>
							<EditOutlined />
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_CUSTOMERS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	return (
		<>
			<Row>
				<Col span={24} style={{ padding: 0 }}>
					<TableComponent
						loading={tableLoading}
						className="custom-table"
						style={{ width: '100%' }}
						columns={column}
						bordered
						rowKey={(record) => record._id}
						dataSource={filteredData}
						rowSelection={rowSelection}
						title={() => (
							<Row style={{ justifyContent: 'space-between' }}>
								<Col span={8}>
									<Row gutter={[10, 10]}>
										<Col xl={24}>
											<Row gutter={[10, 10]} align="middle">
												<Col>
													<Input
														placeholder="Search"
														suffix={<AiOutlineSearch />}
														style={{ height: '30px' }}
														onChange={({ target: { value } }) => setSearchKey(value)}
													/>
												</Col>
												{selectedRowKeys?.length === 1 ? (
													<Col>
														<Popconfirm
															title={`Are you sure to delete this Customer?`}
															okText="Delete"
															cancelText="No"
															onConfirm={() => {
																let url = `${SERVER_IP}customer/${selectedRowKeys?.[0]}?orgId=${globalRedux?.selectedOrganization?.id}`;
																dispatch(deleteApi('DELETE_CUSTOMER', url));
															}}>
															<div style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }}>Delete</div>
														</Popconfirm>
													</Col>
												) : null}
											</Row>
										</Col>
									</Row>
								</Col>
								<Col>
									<Button
										// icon={<PlusOutlined />}
										type="primary"
										// style={{ width: '100%' }}
										onClick={handleAddCustomer}>
										Create Customer
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
								<Col span={12}>
									{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
								</Col>
								<Col span={12}>
									<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
					/>
				</Col>
			</Row>
			<AddDrawer {...{ customerAddModal, setCustomerAddModal, getCustomers, editCustomer }} />
		</>
	);
});

export default Customer;
