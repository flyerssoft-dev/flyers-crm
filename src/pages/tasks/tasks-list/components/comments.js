import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Form, Input, Modal, Row, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// const options = [
// 	{ label: 'Verification', value: 'Verification' },
// 	{ label: 'Billing', value: 'Billing' },
// ];

const DATA = [
	{
		title: 'Medical Expenses',
		remarks: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
    molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
    numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
    optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
    obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
    nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
    tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
    quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos 
    sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam
    recusandae alias error harum maxime adipisci amet laborum.`,
	},
];

const Comments = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		!modalVisible && form.resetFields();
	}, [modalVisible]);

	return (
		<>
			<Row>
				<Col span={24}>
					<Row>
						<Col
							span={24}
							style={{
								textAlign: 'right',
							}}>
							<Button
								style={{
									color: '#006fd9',
									fontWeight: 600,
								}}
								onClick={() => setModalVisible(true)}
								icon={<PlusOutlined />}
								type="link">
								Add Note
							</Button>
						</Col>
						<Col span={24}>
							<Row className="notes_card_container">
								{Array(20)
									.fill(DATA[0])
									?.map((card, index) => (
										<Col
											span={24}
											key={index}
											className="card"
											style={{
												marginBottom: 10,
											}}>
											<Typography.Paragraph ellipsis={{ rows: 3, expandable: false }} className="remarks">
												{card?.remarks}
											</Typography.Paragraph>
											<Row>
												<Col span={24}>
													{/* <span className="title">{card?.title}</span> */}
													<div className="created">Entered by Sathish Saminathan at 12.30 AM</div>
												</Col>
												{/* <Col span={4}>
												<Button type="link">Delete</Button>
											</Col> */}
											</Row>
										</Col>
									))}
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
			<Modal
				title="Add Comments"
				okText="Submit"
				width={'35%'}
				open={modalVisible}
				onOk={() => {
					form.submit();
				}}
				onCancel={() => setModalVisible(false)}
				destroyOnHidden>
				<Row>
					<Col span={24}>
						<Form form={form} requiredMark={false} colon={false} id="add-title" layout="vertical">
							<Row gutter={[10, 10]}>
								<Col span={24}>
									<Form.Item
										label="Comments"
										name="remarks"
										rules={[
											{
												required: true,
												message: 'Please Remarks',
											},
										]}>
										<Input.TextArea placeholder="Enter Remarks" rows={5} />
									</Form.Item>
								</Col>
								{/* <Col span={8}>
									<Form.Item
										label="Select Tag"
										name="tag"
										rules={[
											{
												required: true,
												message: 'Please Select Tag',
											},
										]}>
										<Checkbox.Group defaultValue={['Apple']}>
											<Row>
												{options?.map((option, index) => (
													<Col span={24} key={index}>
														<Checkbox value={option?.value}>{option?.label}</Checkbox>
													</Col>
												))}
											</Row>
										</Checkbox.Group>
									</Form.Item>
								</Col> */}
							</Row>
						</Form>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default Comments;
