import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Popconfirm, Input, Button, Pagination, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SERVER_IP } from 'assets/Config';
import TableComponent from 'components/table-component';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import AddProject from 'pages/projects-new/add-project';
import AssignToModal from './assignto-modal';

const ProjectListPresentational = ({
	filteredData,
	column,
	tableLoading,
	rowSelection,
	selectedRowKeys,
	handleAddProject,
	currentPage,
	pageSize,
	intialPageSizeOptions,
	initialPageSize,
	handleTableChange,
	setSearchKey,
	getStartingValue,
	getEndingValue,
	projectAddModal,
	setProjectAddModal,
	refreshList,
	editProject,
	handleClose,
	selectedProjectId,
	navigate,
}) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const users = useSelector((state) => state?.globalRedux?.users);
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
								<Col span={12}>
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
												<AssignToModal {...{ users, rowSelection, refreshList }} />
												{selectedRowKeys?.length === 1 ? (
													<Col>
														<Popconfirm
															title={`Are you sure to delete this Project?`}
															okText="Delete"
															cancelText="No"
															onConfirm={() => {
																let url = `${SERVER_IP}project/${selectedRowKeys?.[0]}?orgId=${globalRedux?.selectedOrganization?.id}`;
																dispatch(deleteApi('DELETE_PROJECT', url));
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
										onClick={handleAddProject}>
										Create Project
									</Button>
								</Col>
							</Row>
						)}
						onRow={(record, rowIndex) => {
							return {
								onClick: (event) => {
									navigate(`/project/${record._id}`);
								}, // click row
							};
						}}
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
			<AddProject {...{ projectAddModal, setProjectAddModal, refreshList, editProject, handleClose }} />
		</>
	);
};

export default ProjectListPresentational;
