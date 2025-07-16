import React from 'react';
import { Pagination, Row, Col, Button, Input } from 'antd';
import { AiOutlineSearch } from 'react-icons/ai';
import TableComponent from 'components/table-component';
import AddWHInvoice from 'pages/wh-invoice/add-wh-invoice';
import AddTransportInvoice from 'pages/wh-invoice/add-transport-invoice';
import InvoiceReceiptDetailModal from './invoice-receipt-detail-modal';

const WHInvoicePresentational = ({
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
	selectedViewRow,
	setSelectedViewRow,
}) => {
	return (
		<Row style={{ padding: '20px 10px' }}>
			<InvoiceReceiptDetailModal {...{ setSelectedViewRow, selectedViewRow }} />
			<Col xl={24} md={24}>
				<TableComponent
					loading={tableLoading}
					className="custom-table"
					style={{ width: '100%' }}
					rowKey={(record) => record._id}
					dataSource={filteredData}
					title={() => (
						<Row justify="space-between">
							<Col md={3}>
								<Input
									placeholder="Search"
									suffix={<AiOutlineSearch />}
									style={{ height: '30px' }}
									onChange={({ target: { value } }) => setSearchKey(value)}
								/>
							</Col>
							<Col>
								{/* <Button
									type="primary"
									onClick={() => {
										setState({
											...state,
											visible: true,
											invoiceType: 'WH',
										});
									}}>
									New WH Invoice
								</Button> */}
								<Button
									type="primary"
									style={{ marginLeft: 10 }}
									onClick={() => {
										setState({
											...state,
											visible: true,
											invoiceType: 'VEHICLE',
										});
									}}>
									New Transport Invoice
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
			{state?.invoiceType === 'WH' ? (
				<AddWHInvoice {...{ state, setState, refreshList, editData }} />
			) : (
				<AddTransportInvoice {...{ state, setState, refreshList, editData }} />
			)}
		</Row>
	);
};

export default WHInvoicePresentational;
