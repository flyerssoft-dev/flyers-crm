import React, { useEffect } from 'react';
import { Col, Form, Input, Row, Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { API_STATUS } from 'constants/app-constants';

const layer1FormCol = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
};

const Summary = () => {
	const ticketRedux = useSelector((state) => state.ticketRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [form] = Form.useForm();

	const {
		status,
		ticketNumber,
		ticketType,
		description,
		priority,
		customerId: { displayName: customerName = '', email = '', mobile = '' } = {},
		sales,
		serviceCharge,
		discount,
		netTotal,
	} = ticketRedux?.ticketDetails || {};

	useEffect(() => {
		form.setFieldsValue({
			totalSales: sales?.length,
			mobile,
			serviceCharge,
			discount,
			netTotal,
		});
	}, [form, sales, serviceCharge, discount, netTotal, mobile]);

	const loading = globalRedux.apiStatus.GET_TICKETS_DETAILS === API_STATUS.PENDING;

	return (
		<Row className="ticket_details_overview">
			<Col span={24}>
				{loading ? (
					<Col>
						<Skeleton active />
					</Col>
				) : (
					<Form
						name="overview"
						requiredMark={false}
						// colon={false}
						labelAlign="left"
						form={form}
						initialValues={{
							status: status || '',
							customerName: customerName || '',
							email: email || '',
							ticketType: ticketType || '',
							description: description || '',
							priority: priority || '',
							ticketNumber: ticketNumber || '',
						}}
						// onFinish={!editSalesPerson ? addAccBook : handleEdit}
						{...layer1FormCol}>
						<Form.Item
							label="Total Sales"
							name="totalSales"
							// initialValue={'sathish'}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Total Sales" disabled />
						</Form.Item>
						<Form.Item
							label="Service Charge"
							name="serviceCharge"
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Service Charge" disabled />
						</Form.Item>
						<Form.Item
							label="Discount(-)"
							name="discount"
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Discount(-)" disabled />
						</Form.Item>
						<Form.Item
							label="Customer Mobile"
							name="mobile"
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Customer Mobile" disabled />
						</Form.Item>
						<Form.Item
							label="Total Bill Amount"
							name="netTotal"
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Total Bill Amount" disabled />
						</Form.Item>
					</Form>
				)}
			</Col>
		</Row>
	);
};

export default Summary;
