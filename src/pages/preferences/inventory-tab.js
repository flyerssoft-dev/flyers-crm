import React from 'react';
import { Form, Row, Col, Button, Checkbox } from 'antd';
import { Link } from 'react-router-dom';

const layer1FormCol = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 12,
	},
};

const InventoryTab = () => {
	const [form] = Form.useForm();
	const handleSubmit = (values) => {
		console.log(values);
	};
	return (
		<Form labelAlign="left" rootClassName="inventory-tab" form={form} onFinish={handleSubmit} {...layer1FormCol}>
			<Row gutter={[20, 20]}>
				<Col xl={12} md={12}>
					<Form.Item
						label={`Type`}
						className="hideLabel"
						name="type"
						rules={[
							{
								required: true,
								message: 'This Field is required!',
							},
						]}>
						<Checkbox.Group style={{ width: '100%' }}>
							<Row>
								<Col span={24}>
									<Checkbox value="ORDERS">
										Enable Stock Calculation For <Link to="/orders">Orders</Link>
									</Checkbox>
								</Col>
								<Col span={24}>
									<Checkbox value="RETAILS_INVOICE">Enable Stock Calculation For Retail Invoice</Checkbox>
								</Col>
							</Row>
						</Checkbox.Group>
					</Form.Item>
					<Form.Item
						style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}
						wrapperCol={{
							span: 24,
						}}>
						<Button type="primary" htmlType="submit">
							{'Submit'}
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default InventoryTab;
