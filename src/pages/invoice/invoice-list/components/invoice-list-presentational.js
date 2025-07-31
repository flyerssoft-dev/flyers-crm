import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Pagination, Row, Col, Button, Input } from 'antd';
import TableComponent from 'components/table-component';
import AddInvoice from 'pages/invoice/add-invoice';
import UpdateStatusModal from './update-status-modal';
import ItemsModal from './items-modal';

const InvoiceListPresentational = ({
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
	selectedRowKeys,
	selectedViewRow,
	setSelectedViewRow,
}) => {
	return (
		<Row>
			<Col span={24} style={{ padding: 0 }}>
				<TableComponent
					loading={tableLoading}
					rowSelection={rowSelection}
					className="custom-table"
					style={{ width: '100%' }}
					rowKey={(record) => record._id}
					dataSource={filteredData}
					title={() => (
						<Row justify="space-between">
							<Col span={8}>
								<Row gutter={[10, 10]}>
									<Col span={14}>
										<Row gutter={[10, 10]} align="middle">
											<Col span={24}>
												<Input placeholder="Search" suffix={<AiOutlineSearch />} onChange={({ target: { value } }) => setSearchKey(value)} />
											</Col>
										</Row>
									</Col>
									<>
										{/* <Col span={8}>
											<Select
												style={{ width: '100%' }}
												allowClear
												placeholder="Status"
												onChange={(value) => setSelectedStatus(value)}>
												{STATUS_DROPDOWN?.map((status) => (
													<Select.Option value={status}>{status}</Select.Option>
												))}
											</Select>
										</Col> */}
										<UpdateStatusModal {...{ rowSelection, refreshList }} />
									</>
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
									Create Invoice
								</Button>
							</Col>
						</Row>
					)}
					{...{
						columns: column,
						pagination: { current: currentPage, pageSize: pageSize, position: ['none', 'none'] },
						...(!!filteredData?.length && {
							footer: () => (
								<Row justify="space-between" align={'middle'}>
									<Col span={12}>{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}</Col>
									<Col
										span={12}
										style={{
											display: 'flex',
											justifyContent: 'flex-end',
											alignItems: 'center',
										}}>
										<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
											<Pagination pageSizeOptions={intialPageSizeOptions} defaultPageSize={initialPageSize} showSizeChanger={true} total={filteredData?.length} onChange={handleTableChange} responsive />
										</div>
									</Col>
								</Row>
							),
						}),
					}}
				/>
			</Col>
			<AddInvoice {...{ state, setState, refreshList, editData }} />
			<ItemsModal {...{ setSelectedViewRow, selectedViewRow }} />
		</Row>
	);
};

export default InvoiceListPresentational;
