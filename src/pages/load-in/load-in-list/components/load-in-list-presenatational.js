import React from 'react';
import { Pagination, Row, Col, Button } from 'antd';
import TableComponent from 'components/table-component';
import AddLoadIn from 'pages/load-in/add-load-in';

const LoadInPresentational = ({
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
}) => {
	return (
		<Row style={{ padding: '20px 10px' }}>
			<Col xl={24} md={24}>
				<TableComponent
					loading={tableLoading}
					className="custom-table"
					style={{ width: '100%' }}
					rowKey={(record) => record._id}
					dataSource={filteredData}
					title={() => (
						<Row justify="space-between">
							<Col xl={8} md={8}></Col>
							<Col>
								<Button
									type="primary"
									onClick={() =>
										setState({
											...state,
											visible: true,
										})
									}>
									Add New Unload
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
			<AddLoadIn {...{ state, setState, refreshList, editData }} />
		</Row>
	);
};

export default LoadInPresentational;
