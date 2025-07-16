import React from 'react';
import { Select, Row, Col, Input, Form, Modal } from 'antd';
import moment from 'moment';
import TableComponent from 'components/table-component';
import { DATE_FORMAT } from 'constants/app-constants';
import DatePicker from 'components/date-picker';
import { convertToIndianRupees } from 'helpers';

const layer1FormCol = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 8,
	},
};

const PaymentsListPresentational = ({
	column,
	filteredData,
	// handleTableChange,
	// getStartingValue,
	// getEndingValue,
	// pageSize,
	// intialPageSizeOptions,
	// initialPageSize,
	// currentPage,
	tableLoading,
	handleSelectCustomer,
	customers,
	form,
	calculateAmount,
	amountReceivedValue,
	extraAmount,
}) => {
	// const PopconfirmInput = (props) => {
	// 	const { getFieldDecorator } = props.form;
	// 	return (
	// 		<Form.Item label="Amount Received">
	// 			{getFieldDecorator('amountReceived', {
	// 				rules: [
	// 					{
	// 						required: true,
	// 						message: 'This Field is required!',
	// 					},
	// 				],
	// 			})(
	// 				<Popconfirm
	// 					title="Confirm"
	// 					description="Would you like this amount to be reflected in the payment field?"
	// 					open={open}
	// 					placement="bottomLeft"
	// 					onConfirm={calculateAmount}
	// 					onCancel={() => setOpen(false)}
	// 					okText="Yes"
	// 					cancelText="No">
	// 					<Input placeholder="0.00" style={{ width: 400 }} onBlur={() => amountReceivedValue && setOpen(true)} />
	// 				</Popconfirm>
	// 			)}
	// 		</Form.Item>
	// 	);
	// };

	// const WrapperPopconfirmInput = Form.create(PopconfirmInput);

	const [open, setOpen] = React.useState(false);

	// const showModal = () => {
	// 	setOpen(true);
	// };

	const hideModal = () => {
		setOpen(false);
	};
	return (
		<Row style={{ padding: '20px 10px' }}>
			<Modal
				title="Confirm"
				open={open}
				onOk={() => {
					calculateAmount();
					hideModal();
				}}
				onCancel={hideModal}>
				<p>Would you like this amount to be reflected in the payment field?</p>
			</Modal>
			<Col xl={20}>
				<TableComponent
					// rowSelection={rowSelection}
					loading={tableLoading}
					className="custom-table"
					style={{ width: '100%' }}
					rowKey={(record) => record._id}
					dataSource={filteredData}
					title={() => (
						<Form
							// onFinish={handleSubmit}
							name="add-payment"
							scrollToFirstError={{
								behavior: 'smooth',
								block: 'center',
								inline: 'center',
							}}
							colon={false}
							labelAlign="left"
							className="required_in_right"
							form={form}
							{...layer1FormCol}>
							<Row align="middle" gutter={[10, 10]}>
								{/* <Col span={4}>
									<Col className="bold" style={{ fontSize: 14, paddingBottom: 5 }}>
										Customer:
									</Col>
								</Col>
								<Col span={20}>
									<Select
										placeholder="Select Customer"
										style={{ width: 400 }}
										onChange={handleSelectCustomer}
										showSearch
										optionFilterProp="children"
										filterOption={(input, option) =>
											option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
											option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
										}>
										{customers.map((customer) => (
											<Select.Option value={customer?._id} key={customer?._id}>
												{customer?.displayName}
											</Select.Option>
										))}
									</Select>
								</Col>
								<Col span={4}>
									<Col className="bold" style={{ fontSize: 14, paddingBottom: 5 }}>
										Amount Received:
									</Col>
								</Col>
								<Col span={20}>
									<Popconfirm
										title="Confirm"
										description="Would you like this amount to be reflected in the payment field?"
										open={open}
										placement="bottomLeft"
										// onOpenChange={handleOpenChange}
										onConfirm={calculateAmount}
										onCancel={() => setOpen(false)}
										okText="Yes"
										cancelText="No">
										<Input style={{ width: 400 }} onBlur={() => setOpen(true)} />
									</Popconfirm>
								</Col> */}
								<Col span={20}>
									<Form.Item
										label="Customer"
										name="customerId"
										wrapperCol={{
											span: 12,
										}}
										labelCol={{
											span: 8,
										}}
										rules={[
											{
												required: true,
												message: 'This Field is required!',
											},
										]}>
										<Select
											placeholder="Select Customer"
											style={{ width: 400 }}
											onChange={handleSelectCustomer}
											showSearch
											optionFilterProp="children"
											filterOption={(input, option) =>
												option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
												option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
											}>
											{customers.map((customer) => (
												<Select.Option value={customer?._id} key={customer?._id}>
													{customer?.displayName}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col span={20}>
									{/* {getFieldDecorator('amountReceived', {
										rules: [
											{
												required: true,
												message: 'This Field is required!',
											},
										],
									})(
										<Popconfirm
											title="Confirm"
											description="Would you like this amount to be reflected in the payment field?"
											open={open}
											placement="bottomLeft"
											// onOpenChange={handleOpenChange}
											onConfirm={calculateAmount}
											onCancel={() => setOpen(false)}
											okText="Yes"
											cancelText="No">
											<Input placeholder="0.00" style={{ width: 400 }} onBlur={() => amountReceivedValue && setOpen(true)} />
										</Popconfirm>
									)} */}
									{/* <WrapperPopconfirmInput /> */}
									<Form.Item
										label="Amount Received"
										name="amountReceived"
										wrapperCol={{
											span: 12,
										}}
										labelCol={{
											span: 8,
										}}
										rules={[
											{
												required: true,
												message: 'This Field is required!',
											},
										]}>
										{/* <Popconfirm
											title="Confirm"
											description="Would you like this amount to be reflected in the payment field?"
											open={open}
											placement="bottomLeft"
											// onOpenChange={handleOpenChange}
											onConfirm={calculateAmount}
											onCancel={() => setOpen(false)}
											okText="Yes"
											cancelText="No">
											<Input placeholder="0.00" style={{ width: 400 }} onBlur={() => amountReceivedValue && setOpen(true)} />
										</Popconfirm> */}
										<Input
										prefix={'₹'}
											type="number"
											pattern="^-?[0-9]\d*\.?\d*$"
											placeholder="0.00"
											style={{ width: 400 }}
											onBlur={() => {
												(amountReceivedValue && amountReceivedValue > 0) && setOpen(true);
											}}
										/>
									</Form.Item>
								</Col>

								<Col span={20}>
									<Form.Item
										label="Payment date"
										name="paymentDate"
										wrapperCol={{
											span: 12,
										}}
										labelCol={{
											span: 8,
										}}
										initialValue={moment()}
										rules={[
											{
												required: true,
												message: 'This Field is required!',
											},
										]}>
										<DatePicker format={DATE_FORMAT.DD_MM_YYYY} style={{ width: 400 }} placeholder="enter date" />
									</Form.Item>
								</Col>
							</Row>
						</Form>
					)}
					{...{
						columns: column,
						pagination: false,
						// pagination: { current: currentPage, pageSize: pageSize, position: ['none', 'none'] },
						// ...(!!filteredData?.length && {
						// 	footer: () => (
						// 		<Row justify="space-between">
						// 			<Col>
						// 				{!!filteredData?.length &&
						// 					`Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
						// 			</Col>
						// 			<Col md={8}>
						// 				<div style={{ textAlign: 'right' }}>
						// 					<Pagination
						// 						pageSizeOptions={intialPageSizeOptions}
						// 						defaultPageSize={initialPageSize}
						// 						showSizeChanger={true}
						// 						total={filteredData?.length}
						// 						onChange={handleTableChange}
						// 						responsive
						// 					/>
						// 				</div>
						// 			</Col>
						// 		</Row>
						// 	),
						// }),
					}}
					// onChange={handleTableChange}
				/>
				{extraAmount && (
					<Row align="middle" gutter={[10, 10]} style={{ paddingTop: 20 }}>
						<Col span={24}>
							<Col className="bold" style={{ fontSize: 14, paddingBottom: 5 }}>
								Extra Amount: {convertToIndianRupees(extraAmount || 0)}
							</Col>
						</Col>
					</Row>
				)}
			</Col>
		</Row>
	);
};

export default PaymentsListPresentational;
