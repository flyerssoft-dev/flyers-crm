import React, { useState } from 'react';
import { Form, Input, Switch, Button, Row, Col, message } from 'antd';
import { useAppContext } from 'contexts/app-context';

const Configuration = () => {
	const [form] = Form.useForm();
	const [isPasswordVerified, setIsPasswordVerified] = useState(false);
	const [enteredPassword, setEnteredPassword] = useState('');
	const { appConfigs, handleAppConfigChange } = useAppContext(); 

	const correctPassword = 'admin@1234'; // Set your desired password here

	const handleFormSubmit = (values) => {
		console.log('Form Values:', values);
		// You can implement additional logic here if necessary
		message.success('Configuration saved successfully!');
	};

	const verifyPassword = () => {
		if (enteredPassword === correctPassword) {
			setIsPasswordVerified(true);
			message.success('Password verified. You can now access the configuration settings.');
		} else {
			message.error('Incorrect password. Please try again.');
		}
	};

	const handleSwitchChange = (checked, name) => {
		handleAppConfigChange(name, checked);
	};

	return (
		<Row>
			<Col span={6}>
				<Row>
					<Col span={24}>
						{!isPasswordVerified ? (
							<Form form={form} layout="vertical">
								<Form.Item label="Enter Password">
									<Input.Password
										placeholder="Enter password to access settings"
										value={enteredPassword}
										onChange={(e) => setEnteredPassword(e.target.value)}
									/>
								</Form.Item>
								<Form.Item>
									<Button type="primary" htmlType="submit" onClick={verifyPassword}>
										Verify Password
									</Button>
								</Form.Item>
							</Form>
						) : (
							<Form form={form} layout="vertical" onFinish={handleFormSubmit}>
								<Form.Item label="Show Second Invoice" name="showSecondInvoice" valuePropName="checked">
									<Switch
										defaultChecked={appConfigs.showSecondInvoice}
										checked={appConfigs.showSecondInvoice}
										onChange={(checked) => handleSwitchChange(checked, 'showSecondInvoice')}
									/>
								</Form.Item>
								<Form.Item label="Show Outstanding" name="showOutstanding" valuePropName="checked">
									<Switch
										defaultChecked={appConfigs.showOutstanding}
										checked={appConfigs.showOutstanding}
										onChange={(checked) => handleSwitchChange(checked, 'showOutstanding')}
									/>
								</Form.Item>
								{/* <Form.Item>
									<Button type="primary" htmlType="submit">
										Save Configuration
									</Button>
								</Form.Item> */}
							</Form>
						)}
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default Configuration;
