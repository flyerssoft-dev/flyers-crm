import React from 'react';
import { Pagination, Select, Row, Col } from 'antd';
import TableComponent from 'components/table-component';

const FeesStructurePresentational = ({
	column,
	filteredData,
	visible,
	toggleVisible,
	handleTableChange,
	getStartingValue,
	getEndingValue,
	pageSize,
	intialPageSizeOptions,
	initialPageSize,
	currentPage,
	setSearchKey,
	tableLoading,
	rowSelection,
	users,
	classes,
	handleGetStudents,
	loading,
}) => {
	return (
		<Row style={{ padding: '20px 10px' }}>
			<Col xl={24}>
				<TableComponent
					// rowSelection={rowSelection}
					loading={tableLoading}
					className="custom-table"
					style={{ width: '100%' }}
					rowKey={(record) => record._id}
					dataSource={filteredData}
					title={() => (
						<Row>
							<Col md={3}>
								<Col className="bold" style={{ fontSize: 14, paddingBottom: 5 }}>
									Select Class/Grade:
								</Col>
								<Select placeholder="Select Class" style={{ width: 150 }} onChange={handleGetStudents}>
									{classes.map((data) => (
										<Select.Option value={data?._id}>{data?.className}</Select.Option>
									))}
								</Select>
							</Col>
						</Row>
					)}
					{...{
						columns: column,
						pagination: { current: currentPage, pageSize: pageSize, position: ['none', 'none'] },
						...(!!filteredData?.length && {
							footer: () => (
								<Row justify="space-between">
									<Col>
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

					// onChange={handleTableChange}
				/>
			</Col>
		</Row>
	);
};

export default FeesStructurePresentational;
