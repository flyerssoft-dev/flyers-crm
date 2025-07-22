import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Popconfirm, Input, Button, Pagination, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SERVER_IP } from 'assets/Config';
import TableComponent from 'components/table-component';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import AddUnit from 'pages/units/add-unit';

const UnitListPresentational = ({
	filteredData,
	column,
	tableLoading,
	rowSelection,
	selectedRowKeys,
	handleAddUnit,
	currentPage,
	pageSize,
	intialPageSizeOptions,
	initialPageSize,
	handleTableChange,
	setSearchKey,
	getStartingValue,
	getEndingValue,
	unitAddModal,
	setUnitAddModal,
	refreshList,
	editUnit,
	handleClose,
}) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();
	return (
		<>
			<Row>
				<Col xl={12}>
					<TableComponent
						loading={tableLoading}
						className="custom-table"
						style={{ width: '100%' }}
						columns={column}
						bordered
						rowKey={(record) => record._id}
						dataSource={filteredData}
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
															title={`Are you sure to delete this Unit?`}
															okText="Delete"
															cancelText="No"
															onConfirm={() => {
																let url = `${SERVER_IP}unit/${selectedRowKeys?.[0]}?orgId=${globalRedux?.selectedOrganization?.id}`;
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
										onClick={handleAddUnit}>
										Create Unit
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
								<Col span={8}>
									{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
								</Col>
								<Col span={16}>
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
			<AddUnit {...{ unitAddModal, setUnitAddModal, refreshList, editUnit, handleClose }} />
		</>
	);
};

export default UnitListPresentational;
