import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Popconfirm, Input, Button, Pagination, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { SERVER_IP } from 'assets/Config';
import TableComponent from 'components/table-component';
import AddUser from 'pages/users/add-user';

const UserListPresentational = ({
	filteredData,
	column,
	tableLoading,
	rowSelection,
	selectedRowKeys,
	handleAddUser,
	currentPage,
	pageSize,
	intialPageSizeOptions,
	initialPageSize,
	handleTableChange,
	setSearchKey,
	getStartingValue,
	getEndingValue,
	userAddModal,
	setUserAddModal,
	refreshList,
	editUser,
	handleClose,
	userDetail,
}) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();
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
															title={`Are you sure to delete this User?`}
															okText="Delete"
															cancelText="No"
															onConfirm={() => {
																let url = `${SERVER_IP}user/delete/${selectedRowKeys?.[0]}`;
																dispatch(
																	putApi(
																		{
																			userId: userDetail?._id,
																			orgId: globalRedux?.selectedOrganization?._id,
																		},
																		'DELETE_USER',
																		url
																	)
																);
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
										onClick={handleAddUser}>
										Create User
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
					/>
				</Col>
			</Row>
			<AddUser {...{ userAddModal, setUserAddModal, refreshList, editUser, handleClose }} />
		</>
	);
};

export default UserListPresentational;
