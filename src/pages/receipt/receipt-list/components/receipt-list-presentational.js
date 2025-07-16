import React from 'react';
import { Button, Pagination, Row, Col, Input } from 'antd';
import { AiOutlineSearch } from 'react-icons/ai';
import TableComponent from 'components/table-component';
import AddReceipt from 'pages/receipt/add-receipt';

const ReceiptListPresentational = ({
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
	setSearchKey
}) => {
	return (
		<Row style={{ padding: '20px 10px' }}>
			<Col xl={22}>
				<TableComponent
					loading={tableLoading}
					className="custom-table"
					columns={column}
					rowKey={(record) => record._id}
					dataSource={filteredData}
					title={() => (
						<Row justify="space-between">
							<Col span={7}>
								<Input
									placeholder="Search"
									suffix={<AiOutlineSearch />}
									style={{ height: '30px' }}
									onChange={({ target: { value } }) => setSearchKey(value)}
								/>
							</Col>
							<Col span={12}></Col>
							<Col span={5}>
								<Button
									type="primary"
									style={{ width: '100%' }}
									onClick={() => {
										setState({
											...state,
											visible: true,
										});
									}}>
									Create Receipt
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
			<AddReceipt {...{ state, setState, refreshList }} />
		</Row>
	);
};

export default ReceiptListPresentational;
