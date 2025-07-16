import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Pagination, Row, Col, Input, Radio } from 'antd';
import TableComponent from 'components/table-component';

const StocksListPresentational = ({
	column,
	filteredData,
	handleTableChange,
	getStartingValue,
	getEndingValue,
	pageSize,
	intialPageSizeOptions,
	initialPageSize,
	currentPage,
	tableLoading,
	stockType,
	setStockType,
	setSearchKey,
	// rowSelection,
	// selectedRowKeys,
}) => {
	return (
		<Row style={{ padding: '20px 10px' }}>
			<Col xl={24} md={24}>
				<TableComponent
					loading={tableLoading}
					// rowSelection={rowSelection}
					className="custom-table"
					style={{ width: '100%' }}
					rowKey={(record) => record._id}
					dataSource={tableLoading ? [] : filteredData}
					title={() => (
						<Row align={'middle'} justify={'space-between'} gutter={[10,10]}>
							<Col span={6}>
								<Input placeholder="Search" suffix={<AiOutlineSearch />} onChange={({ target: { value } }) => setSearchKey(value)} />
							</Col>
							<Col span={6} style={{textAlign: 'right'}}>
								<Radio.Group onChange={(e) => setStockType(e.target.value)} value={stockType}>
									<Radio value={"STOCK"}>Stock & Value</Radio>
									<Radio value={"SERIAL"}>Serialwise</Radio>
								</Radio.Group>
							</Col>
							{/* <Col>
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
							</Col> */}
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
							),
						}),
					}}
				/>
			</Col>
		</Row>
	);
};

export default StocksListPresentational;
