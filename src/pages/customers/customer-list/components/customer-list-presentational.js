import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Popconfirm, Input, Button, Pagination, Row, Col, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { SERVER_IP } from 'assets/Config';
import TableComponent from 'components/table-component';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import AddCustomer from 'pages/customers/add-customer';
import CustomerDetails from './customer-details';

// Render Table Footer
export const renderTableFooter = (
	selectedData,
	data,
	handleTableChange,
	intialPageSizeOptions,
	initialPageSize,
	getStartingValue,
	getEndingValue
) => (
	<Row justify="space-between" gutter={[20, 20]}>
		<Col span={selectedData ? 24 : 12}>{!!data.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${data.length} Data`}</Col>
		<Col span={selectedData ? 24 : 12}>
			<div style={{ textAlign: selectedData ? 'center' : 'right' }}>
				<Pagination
					pageSizeOptions={intialPageSizeOptions}
					defaultPageSize={initialPageSize}
					showSizeChanger={!Boolean(selectedData)}
					total={data.length}
					onChange={handleTableChange}
					responsive
				/>
			</div>
		</Col>
	</Row>
);

const CustomerListPresentational = ({
	filteredData,
	column,
	tableLoading,
	rowSelection,
	selectedRowKeys,
	handleAddCustomer,
	currentPage,
	pageSize,
	intialPageSizeOptions,
	initialPageSize,
	handleTableChange,
	setSearchKey,
	getStartingValue,
	getEndingValue,
	customerAddModal,
	setCustomerAddModal,
	refreshList,
	editCustomer,
	handleClose,
	selectedCustomerDetails,
}) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	// Get current query params
	const queryParams = queryString.parse(location.search);
	const selectedCustomer = queryParams.selectedCustomer;

	// Handle row click to update query param
	// const handleRowClick = (record) => {
	// 	const newQueryParams = {
	// 		...queryParams,
	// 		selectedCustomer: record._id, // Set the selected customer ID
	// 	};
	// 	navigate(`?${queryString.stringify(newQueryParams)}`, { replace: false });
	// };

	// Render Table Title
	const renderTableTitle = () => {
		if (selectedCustomer) return null;
		return (
			<Row style={{ justifyContent: 'space-between' }}>
				<Col span={8}>
					<Row gutter={[10, 10]}>
						<Col xl={24}>
							<Row gutter={[10, 10]} align="middle">
								<Col>
									<Input
										placeholder="Search"
										suffix={<AiOutlineSearch />}
										onChange={({ target: { value } }) => setSearchKey(value)}
									/>
								</Col>
								{selectedRowKeys?.length === 1 && (
									<Col>
										<Popconfirm
											title="Are you sure to delete this Customer?"
											okText="Delete"
											cancelText="No"
											onConfirm={() => {
												const url = `${SERVER_IP}customer/${selectedRowKeys?.[0]}?orgId=${globalRedux?.selectedOrganization?._id}`;
												dispatch(deleteApi('DELETE_CUSTOMER', url));
											}}>
											<div style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }}>Delete</div>
										</Popconfirm>
									</Col>
								)}
							</Row>
						</Col>
					</Row>
				</Col>
				<Col>
					<Button type="primary" onClick={handleAddCustomer}>
						Create Customer
					</Button>
				</Col>
			</Row>
		);
	};

	return (
		<>
			<Row>
				<Col span={selectedCustomer ? 6 : 24} style={{ padding: 0 }}>
					<TableComponent
						loading={tableLoading}
						scroll={{ y: selectedCustomer ? 'calc(100vh - 220px)' : 'calc(100vh - 260px)' }}
						rowSelection={rowSelection}
						className="custom-table"
						style={{ width: '100%' }}
						columns={column}
						bordered
						rowKey={(record) => record._id}
						dataSource={filteredData}
						// onRow={(record) => ({
						// 	onClick: () => handleRowClick(record),
						// 	style: {
						// 		backgroundColor: selectedCustomer === record._id ? '#e6f7ff' : 'inherit',
						// 		cursor: 'pointer',
						// 	},
						// })}
						{...(selectedCustomer ? {} : { title: renderTableTitle })}
						pagination={{
							current: currentPage,
							pageSize: pageSize,
							position: ['none', 'none'],
						}}
						footer={() =>
							renderTableFooter(
								selectedCustomer,
								filteredData,
								handleTableChange,
								intialPageSizeOptions,
								initialPageSize,
								getStartingValue,
								getEndingValue
							)
						}
					/>
				</Col>
				{selectedCustomer && (
					<Col span={18} style={{ padding: 20 }}>
						<Row>
							<Col
								span={12}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '10px',
								}}>
								<Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large" gap={4}>
									{selectedCustomerDetails.displayName?.charAt(0).toUpperCase()}
								</Avatar>
								<h4>{selectedCustomerDetails?.displayName}</h4>
							</Col>
							<Col span={12} style={{ width: '100%', textAlign: 'right' }}>
								<button
									style={{
										backgroundColor: '#357edd',
										border: 'none',
										borderRadius: '4px',
										color: '#ffffff',
										cursor: 'pointer',
										padding: '8px',
									}}
									onClick={() => navigate('/customers')}>
									Close
								</button>
							</Col>
						</Row>
						<CustomerDetails selectedCustomer={selectedCustomerDetails} />
					</Col>
				)}
			</Row>
			<AddCustomer {...{ customerAddModal, setCustomerAddModal, refreshList, editCustomer, handleClose }} />
		</>
	);
};

export default CustomerListPresentational;
