import React, { useCallback } from 'react';
import { Button, Form, Input, Select, Modal, Drawer, Row, Col, Divider } from 'antd';
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import AddCustomer from 'pages/customers/add-customer';

const { confirm } = Modal;

const layer1FormCol = {
	labelCol: { span: 12 },
	wrapperCol: { span: 12 },
};

const AddTicketPresentational = ({
	visible = false,
	toggleVisible,
	form,
	handleSubmit,
	debounceFn,
	searchList,
	searchString,
	handleRowClick,
	inputString,
	setInputString,
	customers,
	setSelectedCustomer,
	getCustomers,
	customersLoading,
	customerAddModal,
	setCustomerAddModal,
}) => {
	const showConfirm = useCallback(() => {
		confirm({
			title: 'Do you want to close this window?',
			icon: <ExclamationCircleOutlined />,
			content: 'You will lose all the details you have entered.',
			onOk() {
				toggleVisible(false);
			},
		});
	}, [toggleVisible]);

	return (
		<>
			<Drawer maskClosable={false} title="Add New Ticket" placement="right" width="40%" open={visible} destroyOnHidden onClose={showConfirm}>
				<Row gutter={[0, 20]}>
					<Col span={24}>
						<Row gutter={[10, 10]}>
							<Col span={22}>
								<Select
									showSearch
									allowClear
									onClear={() => form.resetFields()}
									optionFilterProp="children"
									filterOption={(input, option) => option.id?.toLowerCase().includes(input.toLowerCase()) || option.key?.toLowerCase().includes(input.toLowerCase())}
									onChange={(value) => setSelectedCustomer(value)}
									placeholder="Select Customer"
									style={{ width: '100%' }}
									dropdownRender={(menu) => (
										<div>
											<div
												style={{
													display: 'flex',
													flexWrap: 'nowrap',
													padding: '0 9px',
													background: '#6ebaff',
												}}
												onClick={() => setCustomerAddModal(true)}>
												<a
													href="#"
													style={{
														flex: 'none',
														color: '#fff',
														padding: '8px',
														display: 'block',
														cursor: 'pointer',
													}}>
													Add New Customer
												</a>
											</div>
											<Divider style={{ margin: '4px 0' }} />
											{menu}
										</div>
									)}>
									{customers?.map((customer) => (
										<Select.Option key={customer?._id} value={customer?._id} id={customer?.displayName}>
											<section>
												<div>{customer?.displayName}</div>
												<div>{customer?.mobile}</div>
											</section>
										</Select.Option>
									))}
								</Select>
							</Col>
							<Col span={2}>
								<Button loading={customersLoading} onClick={getCustomers} type="primary" icon={<SyncOutlined />} />
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<Form name="add-ticket" colon={false} labelAlign="left" form={form} onFinish={handleSubmit} {...layer1FormCol}>
							<Form.Item label="Customer Name" name="customerName" rules={[{ required: true, message: 'This field is required!' }]}>
								<Input placeholder="Customer Name" disabled className="disabled_input_style" />
							</Form.Item>

							<Form.Item label="Mobile Number" name="mobile" rules={[{ required: true, message: 'This field is required!' }]}>
								<Input placeholder="Mobile Number" />
							</Form.Item>

							<Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter address!' }]}>
								<Input.TextArea placeholder="Address" />
							</Form.Item>

							<Form.Item label="Ticket Type" name="ticketType" rules={[{ required: true, message: 'Please select one!' }]}>
								<Select placeholder="Ticket Type">
									{['New Installation', 'Service', 'Shifting', 'Complaint'].map((option) => (
										<Select.Option key={option} value={option}>
											{option}
										</Select.Option>
									))}
								</Select>
							</Form.Item>

							<Form.Item label="Ticket Priority" name="priority" rules={[{ required: true, message: 'Please select one!' }]}>
								<Select placeholder="Ticket Priority">
									{['Normal', 'High', 'Emergency'].map((option) => (
										<Select.Option key={option} value={option}>
											{option}
										</Select.Option>
									))}
								</Select>
							</Form.Item>

							<Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter description!' }]}>
								<Input.TextArea placeholder="Description" />
							</Form.Item>

							<Form.Item wrapperCol={{ span: 24 }}>
								<Row gutter={10}>
									<Col xl={12}>
										<Button style={{ width: '100%' }} type="default" onClick={() => toggleVisible(false)}>
											Cancel
										</Button>
									</Col>
									<Col xl={12}>
										<Button style={{ width: '100%' }} type="primary" htmlType="submit">
											Save
										</Button>
									</Col>
								</Row>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</Drawer>

			<AddCustomer customerAddModal={customerAddModal} setCustomerAddModal={setCustomerAddModal} refreshList={getCustomers} handleClose={() => setCustomerAddModal(false)} />
		</>
	);
};

export default AddTicketPresentational;
