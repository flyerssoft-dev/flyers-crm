import React from 'react';
import { Button, Pagination, Row, Col } from 'antd';
import TableComponent from 'components/table-component';
import AddStudent from 'pages/students/add-student';

const StudentListPresentational = ({
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
	rowSelection,
	users,
	state,
	setState,
}) => {
	return (
		<Row style={{ padding: '20px 10px' }}>
			<Col xl={24}>
				<TableComponent
					loading={tableLoading}
					className="custom-table"
					columns={column}
					rowKey={(record) => record._id}
					dataSource={filteredData}
					title={() => (
						<Row justify="space-between">
							<Col md={3}>
								{/* <Input
									placeholder="Search"
									suffix={<AiOutlineSearch />}
									style={{ height: '30px' }}
									onChange={({ target: { value } }) => setSearchKey(value)}
								/> */}
							</Col>
							<Col md={3}></Col>
							<Col md={4}></Col>
							<Col md={3}>
								<Button
									type="primary"
									style={{ width: '100%' }}
									onClick={() => {
										setState({
											...state,
											visible: true,
										});
									}}>
									Add Student
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
									{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
								</div>
							</Col>
							<Col>
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
			<AddStudent {...{ state, setState, refreshList }} />
		</Row>
	);
};

export default StudentListPresentational;
