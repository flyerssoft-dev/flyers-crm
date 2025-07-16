import React from 'react';
import { Form, Radio, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';

const layer1FormCol = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 12,
	},
};

const ItemsTab = () => {
	const [form] = Form.useForm();
	const handleSubmit = (values) => {
		console.log(values);
	};
	return (
		<Form labelAlign="left" rootClassName="inventory-tab" form={form} onFinish={handleSubmit} {...layer1FormCol}>
			<Row gutter={[20, 20]}>
				<Col xl={12} md={12}>
					<Form.Item
						label={`Rate Type`}
						className="hideLabel"
						name="rateType"
						initialValue={'Transport'}
						rules={[
							{
								required: false,
								message: 'This Field is required!',
							},
						]}>
						<Radio.Group>
							<Radio value={'ORDERS'}>
								Enable Stock Calculation For <Link to="/orders">Orders</Link>
							</Radio>
							<Radio value={'RETAILS_INVOICE'}>Enable Stock Calculation For Retail Invoice</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item
						style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}
						wrapperCol={{
							span: 24,
						}}>
						<Button type="primary" htmlType="submit">{'Submit'}</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default ItemsTab;
