import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Form, InputNumber, Row, Col, Switch, Typography, Divider } from 'antd';
import moment from 'moment';
import DatePicker from 'components/date-picker';
import { DATE_FORMAT, CUSTOMER_TYPE } from 'constants/app-constants';
import { useDispatch, useSelector } from 'react-redux';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';

const { Title } = Typography;

const RandomInvoiceModal = ({ visible, onCancel, onSubmit, confirmLoading }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);
	const customerRedux = useSelector((state) => state.customerRedux);
	const [enableCustomer, setEnableCustomer] = useState(false);
	const [customerCounts, setCustomerCounts] = useState({});

	const customers = useMemo(() => customerRedux.customers || [], [customerRedux.customers]);

	useEffect(() => {
		if (visible) {
			const url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?._id}&type=${CUSTOMER_TYPE[0]}`;
			dispatch(getApi('GET_CUSTOMERS', url));
		}
	}, [visible, dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		if (enableCustomer) {
			const total = Object.values(customerCounts).reduce((sum, val) => sum + (val || 0), 0);
			form.setFieldsValue({ numberOfInvoices: total });
		}
	}, [customerCounts, enableCustomer, form]);

	const handleCustomerCountChange = (customerId, value) => {
		setCustomerCounts((prev) => ({
			...prev,
			[customerId]: value,
		}));
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			const numberOfInvoices = enableCustomer ? Object.values(customerCounts).reduce((sum, val) => sum + (val || 0), 0) : values.numberOfInvoices;

			const customersManual = enableCustomer
				? Object.entries(customerCounts)
						.filter(([, count]) => count > 0)
						.map(([id, count]) => ({
							customerId: id,
							noofInvoices: count,
						}))
				: [];

			const payload = {
				orgId: globalRedux?.selectedOrganization?._id,
				invoiceDate: values.invoiceDate.format('YYYY-MM-DD'),
				numberOfInvoices,
				...(enableCustomer ? { customersManual } : {}),
			};

			onSubmit(payload);
			form.resetFields();
			setCustomerCounts({});
			setEnableCustomer(false);
		});
	};

	return (
		<Modal
			title="Generate Random Invoices"
			open={visible}
			onCancel={() => {
				form.resetFields();
				setCustomerCounts({});
				setEnableCustomer(false);
				onCancel();
			}}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			okText="Submit">
			<Form
				form={form}
				layout="vertical"
				initialValues={{
					invoiceDate: moment(),
					numberOfInvoices: 1,
				}}>
				<Form.Item label="Invoice Date" name="invoiceDate" rules={[{ required: true, message: 'Please select a date' }]}>
					<DatePicker style={{ width: '100%' }} format={DATE_FORMAT.DD_MM_YYYY} />
				</Form.Item>

				<Form.Item label="Number of Invoices" name="numberOfInvoices" rules={[{ required: true, message: 'Please enter number of invoices' }]}>
					<InputNumber min={1} style={{ width: '100%' }} disabled={enableCustomer} />
				</Form.Item>

				<Form.Item label="Enable Customer" valuePropName="checked">
					<Switch checked={enableCustomer} onChange={setEnableCustomer} />
				</Form.Item>

				{enableCustomer && (
					<>
						<Divider />
						<Title level={5} style={{ marginBottom: 10 }}>
							Enable Customers
						</Title>
						<div
							style={{
								maxHeight: 240,
								overflowY: 'auto',
								border: '1px solid #f0f0f0',
								borderRadius: 4,
								padding: 8,
								marginBottom: 16,
							}}>
							<Row style={{ fontWeight: 600, paddingBottom: 8, borderBottom: '1px solid #e8e8e8', marginBottom: 8 }}>
								<Col span={14}>Customer ID</Col>
								<Col span={10}>Count</Col>
							</Row>
							{customers.map((customer) => (
								<Row key={customer._id} style={{ marginBottom: 8 }} gutter={8} align="middle">
									<Col span={14} style={{ wordBreak: 'break-word' }}>
										{customer.customerId || customer.displayName}
									</Col>
									<Col span={10}>
										<InputNumber min={0} value={customerCounts[customer._id] || 0} onChange={(val) => handleCustomerCountChange(customer._id, val)} style={{ width: '100%' }} />
									</Col>
								</Row>
							))}
						</div>
						<Divider />
						<Row>
							<Col span={14}>
								<strong>Total Invoices</strong>
							</Col>
							<Col span={10}>{Object.values(customerCounts).reduce((sum, val) => sum + (val || 0), 0)}</Col>
						</Row>
					</>
				)}
			</Form>
		</Modal>
	);
};

export default RandomInvoiceModal;
