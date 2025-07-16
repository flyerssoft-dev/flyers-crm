import React, { useCallback } from 'react';
import { Button, Select, Modal, Drawer, Row, Checkbox, Col, Form, Input, Radio } from 'antd';
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import DatePicker from 'components/date-picker';
import { DATE_FORMAT, DEPARTMENT_LIST } from 'constants/app-constants';

const { confirm } = Modal;

const layer1FormCol = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 12,
	},
};

const AddTransportInvoicePresentational = ({
	state,
	setState,
	handleSubmit,
	columns,
	loading,
	tableData,
	vendors,
	form,
	handleVendorSelect,
	subTotal,
	cgst,
	sgst,
	igst,
	roundOff,
	totalAmount,
	amountInWords,
	gstPercentage,
	setGstPercentage,
	editData,
	vendorDetails,
	isGstPercentageEnabled,
	setIsGstPercentageEnabled,
}) => {
	const showConfirm = useCallback(() => {
		confirm({
			title: 'Do you want to close this window?',
			icon: <ExclamationCircleOutlined />,
			content: 'You will be lost all the details you have entered here.',
			onOk() {
				setState(state => ({ ...state, visible: false }));
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}, [setState]);

	return (
		// <HotKeys id="hotkeys" keyMap={keyMap} handlers={keyHandlers}>
		<Drawer
			maskClosable={false}
			title={`${editData ? 'Edit' : 'New'} Transport Invoice`}
			placement="right"
			width={'80%'}
			open={state?.visible}
			destroyOnHidden
			className="add_student"
			onClose={showConfirm}
			footer={
				<Row>
					<Col
						xl={{
							span: 8,
							offset: 16,
						}}
						md={12}>
						<Row gutter={[10, 10]} style={{ width: '100%' }} justify="end">
							<Col>
								<Button onClick={() => setState({ ...state, visible: false })}>Cancel</Button>
							</Col>
							<Col>
								<Button
									disabled={!!!vendorDetails || (tableData || [])?.length < 2}
									loading={loading}
									type="primary"
									htmlType="submit"
									onClick={form.submit}>
									{`${editData ? 'Update' : 'Submit'}`}
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			}>
			<Row justify="center">
				<Col xl={24} md={24}>
					<TableComponent
						{...{
							columns,
							dataSource: tableData,
							pagination: false,
							footer: () => (
								<Row style={{ fontSize: 14 }}>
									<Col xl={18} md={18}>
										<Col xl={24} md={24} className="bold" style={{ paddingRight: 10 }}>
											Amount in words
										</Col>
										<Col xl={24} md={24}>
											{amountInWords}
										</Col>
									</Col>
									<Col xl={6} md={6}>
										<Row>
											<Col xl={12} md={12}>
												Sub Total
											</Col>
											<Col xl={1} md={1}>
												:
											</Col>
											<Col xl={11} md={11} style={{ textAlign: 'right', fontWeight: 'bold' }}>
												{subTotal}
											</Col>
										</Row>
										<Row style={{ padding: '10px 0' }}>
											<Col xl={12} md={12}>
												GST %
											</Col>
											<Col xl={1} md={1}>
												:
											</Col>
											<Col xl={11} md={11} style={{ textAlign: 'right', fontWeight: 'bold' }}>
												<Select
													value={gstPercentage}
													placeholder="select"
													style={{ width: 80 }}
													onChange={(value) => setGstPercentage(value)}>
													<Select.Option value="0">0</Select.Option>
													<Select.Option value="5">5</Select.Option>
													<Select.Option value="12">12</Select.Option>
													<Select.Option value="18">18</Select.Option>
													<Select.Option value="28">28</Select.Option>
												</Select>
											</Col>
										</Row>
										<Row>
											<Col xl={12} md={12}>
												SGST {isGstPercentageEnabled ? 0 : gstPercentage / 2}%
											</Col>
											<Col xl={1} md={1}>
												:
											</Col>
											<Col xl={11} md={11} style={{ textAlign: 'right', fontWeight: 'bold' }}>
												{sgst}
											</Col>
										</Row>
										<Row>
											<Col xl={12} md={12}>
												CGST {isGstPercentageEnabled ? 0 : gstPercentage / 2}%
											</Col>
											<Col xl={1} md={1}>
												:
											</Col>
											<Col xl={11} md={11} style={{ textAlign: 'right', fontWeight: 'bold' }}>
												{cgst}
											</Col>
										</Row>
										<Row>
											<Col xl={12} md={12}>
												<Checkbox
													checked={isGstPercentageEnabled}
													onChange={({ target: { checked } }) => setIsGstPercentageEnabled(checked)}
												/>{' '}
												IGST {isGstPercentageEnabled ? gstPercentage : 0}%
											</Col>
											<Col xl={1} md={1}>
												:
											</Col>
											<Col xl={11} md={11} style={{ textAlign: 'right', fontWeight: 'bold' }}>
												{igst}
											</Col>
										</Row>
										<Row>
											<Col xl={12} md={12}>
												Round Off (+/-)
											</Col>
											<Col xl={1} md={1}>
												:
											</Col>
											<Col xl={11} md={11} style={{ textAlign: 'right', fontWeight: 'bold' }}>
												{roundOff || 0}
											</Col>
										</Row>
										<Row>
											<Col xl={12} md={12}>
												Grand Total
											</Col>
											<Col xl={1} md={1}>
												:
											</Col>
											<Col xl={11} md={11} style={{ textAlign: 'right', fontWeight: 'bold' }}>
												{totalAmount}
											</Col>
										</Row>
									</Col>
								</Row>
							),
							title: () => (
								<Row justify="space-between">
									<Col xl={24} md={24}>
										<Form labelAlign="left" form={form} onFinish={handleSubmit} {...layer1FormCol}>
											<Row gutter={[20, 20]}>
												<Col xl={12} md={12}>
													<Form.Item
														label="Vendor Name"
														name="vendorId"
														// initialValue={editBatch?.vendorId}
														rules={[
															{
																required: true,
																message: 'This Field is required!',
															},
														]}>
														<Select placeholder="select vendor" onChange={(a) => handleVendorSelect(a)}>
															{vendors?.map((vendor) => (
																<Select.Option value={vendor?._id}>{vendor?.vendorName}</Select.Option>
															))}
														</Select>
													</Form.Item>
													<Form.Item
														label="Billing Address"
														name="billingAddress"
														// initialValue={editBatch?.poNumber}
														rules={[
															{
																required: true,
																message: 'This Field is required!',
															},
														]}>
														<Input.TextArea placeholder="Enter Billing Address" rows={4} />
													</Form.Item>
													<Form.Item
														label="Notes"
														name="notes"
														// initialValue={editBatch?.poNumber}
														rules={[
															{
																required: false,
																message: 'This Field is required!',
															},
														]}>
														<Input.TextArea placeholder="Enter notes" />
													</Form.Item>
												</Col>
												<Col xl={12} md={12}>
													<Form.Item
														label="PO Number"
														name="poNumber"
														// initialValue={editBatch?.poNumber}
														rules={[
															{
																required: false,
																message: 'This Field is required!',
															},
														]}>
														<Input placeholder="Enter PO NUmber" />
													</Form.Item>
													<Form.Item
														label="GSTIN"
														name="gstin"
														// initialValue={editBatch?.poNumber}
														rules={[
															{
																required: true,
																message: 'This Field is required!',
															},
														]}>
														<Input placeholder="Enter gstin" />
													</Form.Item>
													<Form.Item
														label="Invoice date"
														initialValue={moment()}
														rules={[{ required: true }]}
														name="invoiceDate">
														<DatePicker style={{ width: '100%' }} format={DATE_FORMAT.DD_MM_YYYY} />
													</Form.Item>
													<Form.Item
														label="Department"
														name="department"
														rules={[
															{
																required: true,
																message: 'This Field is required!',
															},
														]}>
														<Select placeholder="select department">
															{DEPARTMENT_LIST?.map((department) => (
																<Select.Option value={department}>{department}</Select.Option>
															))}
														</Select>
													</Form.Item>
													<Form.Item
														label={`Rate Type`}
														// label={`Rate Type (${rateTypeValue === 'Transport' ? vendorDetails?.transportRate : vendorDetails?.warehouseRate})`}
														name="rateType"
														initialValue={'Transport'}
														rules={[
															{
																required: false,
																message: 'This Field is required!',
															},
														]}>
														<Radio.Group>
															<Radio value={'Transport'}>Transport (₹{vendorDetails?.transportRate || 0})</Radio>
															<Radio value={'Warehouse'}>Warehouse (₹{vendorDetails?.warehouseRate || 0})</Radio>
														</Radio.Group>
													</Form.Item>
												</Col>
											</Row>
										</Form>
									</Col>
								</Row>
							),
						}}
					/>
				</Col>
			</Row>
		</Drawer>
		// </HotKeys>
	);
};

export default AddTransportInvoicePresentational;
