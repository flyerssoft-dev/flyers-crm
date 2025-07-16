import React from 'react';
import { Button, Col, Divider, Form, Input, Row, Select, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { TbFileInvoice } from 'react-icons/tb';
import TableComponent from 'components/table-component';
import DatePicker from 'components/date-picker';
import AddDrawer from 'components/drawer-component';
import AddCustomer from 'pages/customers/add-customer';
import { inWords } from 'services/Utils';
import SalesPersonModal from 'components/sales-person-modal';
import ProjectModal from 'components/project-modal';
import AddSerialModal from 'components/add-serial-modal';
import { DATE_FORMAT, ITEM_TAX_TYPE, PLACE_OF_SUPPLY } from 'constants/app-constants';

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 12 },
};

const AddInvoicePresentational = ({
	columns = [],
	dataSource = [],
	customers = [],
	customerAddModal = false,
	setCustomerAddModal = () => {},
	getCustomers = () => {},
	itemAddModal = false,
	setItemAddModal = () => {},
	getItems = () => {},
	form,
	billingDetails = {},
	shippingDetails = {},
	customerIdValue = null,
	handleSubmit = () => {},
	subTotal = 0,
	roundOff = 0,
	totalAmount = 0,
	navigate = () => {},
	loading = false,
	invoiceDetails = { loading: false, data: null },
	invoiceInputDetails = { shippingCharges: 0 },
	setInvoiceInputDetails = () => {},
	selectedData = null,
	setSelectedData = () => {},
	tableData = [],
	setTableData = () => {},
	handleInputChange = () => {},
	totalTaxableAmount = 0,
}) => {
	if (invoiceDetails?.loading) {
		return (
			<Row justify="center" align="middle" style={{ height: '100%' }}>
				<Col>
					<Spin tip="Loading invoice..." />
				</Col>
			</Row>
		);
	}

	const renderAddressBlock = (label, details) => (
		<Form.Item label={label} {...layout}>
			<Row>
				{['addressLine1', 'addressLine2', 'city', 'pincode'].map((field) => (
					<Col key={field} span={24}>
						{details?.[field]}
					</Col>
				))}
			</Row>
		</Form.Item>
	);

	const renderTotalFooter = () => (
		<Row style={{ fontSize: 14 }}>
			<Col xl={18} md={18}>
				<Col className="bold" style={{ paddingRight: 10 }}>
					Amount in words
				</Col>
				<Col className="inwords">{inWords(totalAmount)}</Col>
			</Col>
			<Col xl={6} md={6}>
				{[
					['Sub Total', parseFloat(subTotal).toFixed(2)],
					['Taxable Total', parseFloat(totalTaxableAmount).toFixed(2)],
					[
						'Shipping Charges',
						<Input
							style={{ width: '100%' }}
							type="number"
							className="textAlignRight"
							onChange={({ target: { value } }) => setInvoiceInputDetails({ shippingCharges: value })}
							value={invoiceInputDetails?.shippingCharges}
							placeholder="0.00"
						/>,
					],
					['Round Off (+/-)', roundOff || 0],
					['Grand Total ( ₹ )', parseFloat(totalAmount).toFixed(2)],
				].map(([label, value]) => (
					<Row key={label}>
						<Col span={14} style={{ textAlign: 'right', paddingRight: 10 }}>
							{label}
						</Col>
						<Col span={1}>:</Col>
						<Col span={9} style={{ textAlign: 'right', fontWeight: 'bold' }}>
							{value}
						</Col>
					</Row>
				))}
			</Col>
		</Row>
	);

	return (
		<>
			<AddSerialModal {...{ visible: !!selectedData, selectedData, setSelectedData, tableData, setTableData, handleInputChange }} />
			<Row className="new_invoice_container">
				<Col span={24}>
					<Row className="header" align="middle">
						<TbFileInvoice className="icon" />
						<span className="title">{invoiceDetails?.data ? 'Invoice Details' : 'New Invoice'}</span>
					</Row>
				</Col>
				<Col span={24}>
					<Form form={form} name="add-invoice" onFinish={handleSubmit} labelAlign="left" colon={false} className="required_in_right" scrollToFirstError={{ behavior: 'smooth', block: 'center', inline: 'center' }} {...layout}>
						<Row>
							<Col span={12}>
								{/* Customer Dropdown with Add option */}
								<Form.Item label="Customer Name" name="customerId" style={{ paddingTop: 20 }} rules={[{ required: true, message: 'This Field is required!' }]}>
									<Select
										placeholder="Select Customer"
										showSearch
										optionFilterProp="children"
										filterOption={(input, option) => option.children?.toLowerCase().includes(input.toLowerCase())}
										filterSort={(a, b) => a.children?.toLowerCase().localeCompare(b.children?.toLowerCase())}
										dropdownRender={(menu) => (
											<div>
												{menu}
												<Divider />
												<div style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer' }} onClick={() => setCustomerAddModal(true)}>
													<a style={{ flex: 'none', color: '#188dfa', padding: 8, display: 'block' }}>
														<PlusOutlined /> Customer
													</a>
												</div>
											</div>
										)}>
										{customers?.map((customer) => (
											<Select.Option key={customer?._id} value={customer?._id}>
												{customer?.displayName}
											</Select.Option>
										))}
									</Select>
								</Form.Item>

								{/* Invoice & Due Dates */}
								<Form.Item label="Invoice date" name="invoiceDate" initialValue={moment()} rules={[{ required: true, message: 'Required!' }]}>
									<DatePicker format={DATE_FORMAT.DD_MM_YYYY} style={{ width: '100%' }} />
								</Form.Item>
								<Form.Item label="Due date" name="dueDate" initialValue={moment()}>
									<DatePicker format={DATE_FORMAT.DD_MM_YYYY} style={{ width: '100%' }} />
								</Form.Item>

								{/* Sales Person & Project */}
								<Form.Item label="Sales Person" name="salesPersonId">
									<SalesPersonModal />
								</Form.Item>
								<Form.Item label="Project" name="projectId">
									<ProjectModal />
								</Form.Item>

								{/* Place of Supply */}
								<Form.Item label="Place of Supply" name="placeOfSupply" initialValue={PLACE_OF_SUPPLY[0]} rules={[{ required: true }]}>
									<Select placeholder="Place of Supply">
										{PLACE_OF_SUPPLY.map((type) => (
											<Select.Option key={type} value={type}>
												{type}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							{/* Addresses */}
							{customerIdValue && (
								<Col span={12}>
									{renderAddressBlock('Billing Address', billingDetails)}
									{renderAddressBlock('Shipping Address', shippingDetails)}
								</Col>
							)}
						</Row>

						{/* Table and Summary */}
						<Col span={18}>
							<TableComponent pagination={false} columns={columns} dataSource={dataSource} footer={renderTotalFooter} />
						</Col>
					</Form>
				</Col>

				{/* Bottom Actions */}
				<Col span={24} className="footer">
					<Button disabled={invoiceDetails?.data} loading={loading} type="primary" style={{ marginRight: 10 }} onClick={form?.submit}>
						Proceed to Submit
					</Button>
					<Button onClick={() => navigate(-1)} type="ghost">
						Close
					</Button>
				</Col>

				{/* Modals */}
				<AddCustomer customerAddModal={customerAddModal} setCustomerAddModal={setCustomerAddModal} refreshList={getCustomers} handleClose={() => setCustomerAddModal(false)} />
				<AddDrawer itemAddModal={itemAddModal} setItemAddModal={setItemAddModal} getItems={getItems} />
			</Row>
		</>
	);
};

export default AddInvoicePresentational;
