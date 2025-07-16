import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { Button, Select, Modal, Drawer, Row, Col, Input, Form, InputNumber } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import DatePicker from 'components/date-picker';
import { DATE_FORMAT, INVOICE_TYPE } from 'constants/app-constants';
import AddSerialModal from 'components/add-serial-modal';

const { confirm } = Modal;

const layer1FormCol = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

const paymentModeData = ['cash', 'cheque', 'upi', 'neft', 'rtgs', 'imps'];

const AddReceiptPresentational = ({
	state,
	setState,
	handleSubmit,
	columns,
	loading,
	handleInputChange,
	selectedData,
	setSelectedData,
	tableData,
	setTableData,
	form,
	customers,
	isValid,
	selectedCustomer,
	amountReceived,
	amountUsedForPayments,
	amountRefunded,
	amountInExcess,
	paymentModeValue,
	invoiceLoading,
}) => {
	// Check if Amount used for Payments is greater than Amount Received
	const isPaymentExceeds = useMemo(() => amountUsedForPayments > amountReceived, [amountUsedForPayments, amountReceived]);

	const showConfirm = useCallback(() => {
		confirm({
			title: 'Do you want to close this window?',
			icon: <ExclamationCircleOutlined />,
			content: 'You will be lost all the details you have entered here.',
			onOk: () => setState((s) => ({ ...s, visible: false, selectedRow: null })),
		});
	}, [setState]);

	const renderFooterSummary = () => (
		<Row className="footer-summary">
			<Col xl={12} md={12} />
			<Col xl={12} md={12}>
				{[
					{ label: 'Amount Received', value: amountReceived },
					{ label: 'Amount used for Payments', value: amountUsedForPayments },
					{ label: 'Amount in Excess', value: amountInExcess },
				].map(({ label, value }) => (
					<Row key={label} className={`footer-item ${isPaymentExceeds && label === 'Amount used for Payments' ? 'isPaymentExceeds' : ''}`}>
						<Col xl={18} md={18} className="footer-label">{label}</Col>
						<Col xl={1} md={1}>:</Col>
						<Col xl={5} md={5} className="footer-value">
							{parseFloat(value || 0).toFixed(2)}
						</Col>
					</Row>
				))}
			</Col>
		</Row>
	);

	const renderFormFields = () => (
		<Row gutter={[20, 20]} justify={'space-between'}>
			<Col xl={12} md={12}>
				<Form.Item label="Receipt date" initialValue={moment()} rules={[{ required: true }]} name="receiptDate">
					<DatePicker style={{ width: '100%' }} format={DATE_FORMAT.DD_MM_YYYY} />
				</Form.Item>

				<Form.Item label="Customer" name="customerId" rules={[{ required: true, message: 'This Field is required!' }]}>
					<Select
						showSearch
						placeholder="select customer"
						filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase()) || option.props.value.toLowerCase().includes(input.toLowerCase())}
						onChange={() => form.setFieldsValue({ invoiceId: null })}>
						{customers?.map((customer) => (
							<Select.Option key={customer._id} value={customer._id}>
								{customer?.displayName}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				{selectedCustomer && <div style={{ textAlign: 'right', marginTop: -10, fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Closing Balance: {selectedCustomer?.closingBalance}</div>}

				<Form.Item label="Amount" name="receiptAmount" rules={[{ required: true }]}>
					<InputNumber placeholder="enter amount" style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item label="Payment Mode" name="paymentMode" initialValue="cash">
					<Select placeholder="select payment mode">
						{paymentModeData.map((mode) => (
							<Select.Option key={mode} value={mode}>
								{mode.toUpperCase()}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item label="Reference Number" name="referenceNumber">
					<Input placeholder="Enter Ref. no" style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item label="Remarks/Notes" name="remarks">
					<Input.TextArea placeholder="Enter Remarks" />
				</Form.Item>
			</Col>
		</Row>
	);

	return (
		<>
			<Drawer
				maskClosable={false}
				title={`${state?.selectedRow ? 'Edit' : 'Create'} Receipt`}
				placement="right"
				width="80%"
				open={state?.visible}
				destroyOnHidden
				className="add_receipt_drawer"
				onClose={showConfirm}
				footer={
					<Row>
						<Col xl={{ span: 9, offset: 15 }} md={12}>
							<Row gutter={[10, 10]} justify="end">
								<Col>
									<Button onClick={() => setState({ ...state, visible: false, selectedRow: null })}>Cancel</Button>
								</Col>
								<Col>
									<Button
										disabled={isPaymentExceeds || !isValid} // Disable the button if the condition is met or form is invalid
										loading={loading}
										type="primary"
										htmlType="submit"
										onClick={() => form.submit()}>
										{state?.selectedRow ? 'Update' : 'Submit'}
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				}>
				<Row justify="start">
					<Col xl={23} md={23}>
						<TableComponent
							bordered={false}
							columns={columns}
							dataSource={tableData}
							pagination={false}
							loading={invoiceLoading}
							title={() => (
								<Row justify="space-between">
									<Col xl={24} md={24}>
										<Form form={form} name="add-receipt" onFinish={handleSubmit} labelAlign="left" className="add-receipt required_in_right" {...layer1FormCol}>
											{renderFormFields()}
										</Form>
									</Col>
								</Row>
							)}
							footer={renderFooterSummary}
						/>
					</Col>
				</Row>

				<AddSerialModal visible={!!selectedData} handleInputChange={handleInputChange} selectedData={selectedData} setSelectedData={setSelectedData} tableData={tableData} setTableData={setTableData} />
			</Drawer>
		</>
	);
};

export default AddReceiptPresentational;
