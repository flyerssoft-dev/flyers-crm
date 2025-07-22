import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Pagination, Row, Col, Button, Input } from 'antd';
import TableComponent from 'components/table-component';
import AddTask from 'pages/tasks/add-task';
import Comments from './comments';
import TaskAssignToModal from './task-assign-modal';
// import UpdateStatusModal from './update-status-modal';

const TasksListPresentational = ({
	column,
	filteredData,
	handleTableChange,
	getStartingValue,
	getEndingValue,
	pageSize,
	intialPageSizeOptions,
	initialPageSize,
	currentPage,
	refreshList,
	tableLoading,
	state,
	setState,
	editData,
	setSearchKey,
	rowSelection,
	// selectedRowKeys,
	onRowClick,
	selectedData,
	setSelectedData,
	users,
}) => {
	return (
		<Row style={{ padding: 10, background: '#f6f6fa', height: '100%' }} gutter={[20, 20]}>
			<Col span={Boolean(selectedData) ? 18 : 24}>
				<TableComponent
					loading={tableLoading}
					rowSelection={rowSelection}
					className="custom-table"
					style={{ width: '100%' }}
					rowKey={(record) => record._id}
					dataSource={filteredData}
					onRow={(record, rowIndex) => {
						return {
							onClick: (event) => {
								onRowClick(record);
							},
						};
					}}
					title={() => (
						<Row justify="space-between">
							<Col span={12}>
								<Row gutter={[10, 10]}>
									<Col span={8}>
										<Input
											placeholder="Search"
											suffix={<AiOutlineSearch />}
											onChange={({ target: { value } }) => setSearchKey(value)}
										/>
									</Col>
									<TaskAssignToModal {...{ users, rowSelection, refreshList }} />
									{/* {selectedRowKeys?.length > 0 && <UpdateStatusModal {...{ rowSelection, refreshList }} />} */}
								</Row>
							</Col>

							<Col>
								<Button
									type="primary"
									onClick={() =>
										setState({
											...state,
											visible: true,
										})
									}>
									Create Task
								</Button>
							</Col>
						</Row>
					)}
					{...{
						columns: column,
						pagination: { current: currentPage, pageSize: pageSize, position: ['none', 'none'] },
						...(!!filteredData?.length && {
							footer: () => (
								<Row justify="space-between">
									<Col md={16}>
										{!!filteredData?.length &&
											`Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
									</Col>
									<Col md={8}>
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
							),
						}),
					}}
				/>
			</Col>
			{Boolean(selectedData) && (
				<Col
					xl={6}
					md={6}
					style={{
						padding: 10,
						background: '#fff',
						borderRadius: 5,
					}}>
					<Button
						type="primary"
						danger
						onClick={() => {
							setSelectedData(null);
						}}>
						Close
					</Button>
					<Comments />
				</Col>
			)}
			<AddTask {...{ state, setState, refreshList, editData }} />
		</Row>
	);
};

export default TasksListPresentational;
