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

const Overview = () => {
	const ticketRedux = useSelector((state) => state.ticketRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [form] = Form.useForm();

	const {
		status,
		ticketNumber,
		ticketType,
		description,
		priority,
		createdBy,
		customerId: { displayName: customerName = "", email  =""} = {},
	} = ticketRedux?.ticketDetails || {};
	console.log("🚀 ~ file: overview.js:28 ~ Overview ~ ticketRedux?.ticketDetails:", ticketRedux?.ticketDetails)

	useEffect(() => {
		form.setFieldsValue({
			status,
			ticketNumber,
			ticketType,
			description,
			priority,
			customerName,
			email,
			createdBy: `${createdBy?.firstName} ${createdBy?.lastName}` || ''
		});
	}, [status, ticketNumber, ticketType, description, priority, customerName, email, form, createdBy]);

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
							createdBy: `${createdBy?.firstName} ${createdBy?.lastName}` || '',
						}}
						// onFinish={!editSalesPerson ? addAccBook : handleEdit}
						{...layer1FormCol}>
						<Form.Item
							label="Status"
							name="status"
							// initialValue={'sathish'}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Status" disabled />
						</Form.Item>
						<Form.Item
							label="Ticket Type"
							name="ticketType"
							// initialValue={'sathish'}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Ticket Type" disabled />
						</Form.Item>
						<Form.Item
							label="Customer Name"
							name="customerName"
							// initialValue={'sathish'}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Display name" disabled />
						</Form.Item>
						<Form.Item
							label="Description"
							name="description"
							// initialValue={'sathish'}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Description" disabled />
						</Form.Item>
						<Form.Item
							label="Priority"
							name="priority"
							// initialValue={'sathish'}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Priority" disabled />
						</Form.Item>
						<Form.Item
							label="Ticket Number"
							name="ticketNumber"
							// initialValue={'sathish'}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Ticket Number" disabled />
						</Form.Item>
						<Form.Item
							label="Email"
							name="email"
							// initialValue={editSalesPerson?.email}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Email" disabled />
						</Form.Item>
						<Form.Item
							label="Created by"
							name="createdBy"
							// initialValue={editSalesPerson?.email}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Created by" disabled />
						</Form.Item>
					</Form>
				)}
			</Col>
		</Row>
	);
};

export default Overview;
