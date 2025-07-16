import React from 'react';
import { Col, Form, Input, Row } from 'antd';

const layer1FormCol = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
};

const Overview = () => {
	const [form] = Form.useForm();
	return (
		<Row className="invoice_details_overview">
			<Col span={12}>
				<Form
					name="overview"
					requiredMark={false}
					// colon={false}
					labelAlign="left"
					form={form}
					initialValues={{
						status: 'Open',
						customerName: 'Sathish',
						email: 'sathish@gmail.com',
						ticketType: 'Connection',
						description: 'Test desc',
						priority: 'High',
						ticketNumber: '#12312',
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
					{/* <Form.Item
								style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}
								wrapperCol={{
									span: 24,
								}}>
								<Row justify="space-between">
									<Button style={{ width: '49%' }} danger>
										Cancel
									</Button>
									<Button loading={loading} type="primary" style={{ width: '49%', marginRight: 5 }} htmlType="submit">
										{editSalesPerson ? 'Update' : 'Save'}
									</Button>
								</Row>
							</Form.Item> */}
				</Form>
			</Col>
		</Row>
	);
};

export default Overview;
