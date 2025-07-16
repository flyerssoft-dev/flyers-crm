import React, { useCallback } from 'react';
import { Button, Form, Input, Select, Modal, Drawer, Row, Col } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DATE_FORMAT } from 'constants/app-constants';
import DatePicker from 'components/date-picker';

const { confirm } = Modal;

const formItemLayout = {
	labelCol: { span: 24 },
	wrapperCol: { span: 22 },
};

const RELIGION = ['Religion not disclosed', 'Hindu', 'Christian', 'Muslim', 'Other', 'Jainism', 'Sikh', 'Buddhism'];
const BLOOD_GROUP = [
	'A+ve',
	'A-ve',
	'B+ve',
	'B-ve',
	'AB+ve',
	'AB-ve',
	'O+ve',
	'O+ve',
	'A1+ve',
	'A1-ve',
	'A1B+ve',
	'A1B-ve',
	'A2+ve',
	'A2-ve',
	'A2B+ve',
	'A2B-ve',
	'B1+ve',
];

const AddStudentPresentational = ({ state, setState, form, handleSubmit, classes = [], loading, handleEdit }) => {
	const showConfirm = useCallback(() => {
		confirm({
			title: 'Do you want to close this window?',
			icon: <ExclamationCircleOutlined />,
			content: 'You will be lost all the details you have entered here.',
			onOk() {
				setState((state) => ({
					...state,
					visible: false,
				}));
			},
			onCancel() {},
		});
	}, [setState]);

	const isEditMode = !!state?.selectedRow;

	return (
		<Drawer
			maskClosable={false}
			title={`${isEditMode ? 'Edit' : 'Add New'} Student`}
			placement="right"
			width={'50%'}
			open={state?.visible}
			destroyOnHidden
			className="add_student"
			onClose={showConfirm}
			footer={
				<Row>
					<Col
						xl={{
							span: 9,
							offset: 15,
						}}
						md={12}>
						<Row gutter={[10, 10]} style={{ width: '100%' }} justify="end">
							<Col>
								<Button
									onClick={() =>
										setState({
											...state,
											visible: false,
										})
									}>
									Cancel
								</Button>
							</Col>
							<Col>
								<Button loading={loading} type="primary" htmlType="submit" onClick={() => form.submit()}>
									{isEditMode ? 'Update' : 'Submit'}
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			}>
			<Row justify="center">
				<Col xl={20} md={20}>
					<Form
						form={form}
						className="form-container"
						{...formItemLayout}
						onFinish={(values) => (state?.selectedRow ? handleEdit(values) : handleSubmit(values))}>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Student Type" rules={[{ required: true }]} name="studentType">
									<Select placeholder="select student type">
										<Select.Option value="Regular">Regular</Select.Option>
										<Select.Option value="RTE">RTE</Select.Option>
									</Select>
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Admission Number" name="admissionNumber" rules={[{ required: true }]}>
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Student Name" name="studentName" rules={[{ required: true }]}>
									<Input />
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Name in Tamil" name="unicodeName">
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Class/Grade" name="classId" rules={[{ required: true }]}>
									<Select>
										{classes.map((data) => (
											<Select.Option value={data?._id}>{data?.className}</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Section" name="section">
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Primary Mobile" name="primaryMobile" rules={[{ required: true }]}>
									<Input maxLength={10} placeholder="Primary Mobile" />
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Secondary Mobile" name="secondaryMobile">
									<Input maxLength={10} placeholder="Secondary Mobile" />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Date of Join" name="dateofJoin">
									<DatePicker style={{ width: '100%' }} format={DATE_FORMAT.DD_MM_YYYY} />
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Date of Birth" name="dateofBirth" rules={[{ required: true }]}>
									<DatePicker style={{ width: '100%' }} format={DATE_FORMAT.DD_MM_YYYY} />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
									<Select>
										<Select.Option value="Male">Male</Select.Option>
										<Select.Option value="Female">Female</Select.Option>
										<Select.Option value="Transgender">Transgender</Select.Option>
									</Select>
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Email" name="email">
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Aadhar Card" name="aadharCard">
									<Input />
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Pan Card" name="panCard">
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Father Name" name="fatherName">
									<Input />
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Father Occupation" name="fatherOccupation">
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Mother Name" name="motherName">
									<Input />
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Mother Occupation" name="motherOccupation">
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Guardian Name" name="guardianName">
									<Input />
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Guardian Occupation" name="guardianOccupation">
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Community" name="community">
									<Input />
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Medium" name="medium" rules={[{ required: true }]}>
									<Select>
										<Select.Option value="Tamil">Tamil</Select.Option>
										<Select.Option value="English">English</Select.Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Religion" name="religion" rules={[{ required: true }]}>
									<Select>
										{RELIGION.map((data, index) => (
											<Select.Option value={data}>{data}</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="EMIS ID" name="emisId">
									<Input />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Blood Group" name="bloodGroup" rules={[{ required: true }]}>
									<Select>
										{BLOOD_GROUP.map((data, index) => (
											<Select.Option value={data}>{data}</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item label="Mother tongue" name="mothertongue">
									<Select>
										<Select.Option value="Tamil">Tamil</Select.Option>
										<Select.Option value="English">English</Select.Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item name="residentialAddress" label="Residential Address">
									<Input.TextArea />
								</Form.Item>
							</Col>
							<Col xl={12} md={12}>
								<Form.Item name="permanentAddress" label="Permanent Address">
									<Input.TextArea />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={[0, 10]}>
							<Col xl={12} md={12}>
								<Form.Item label="Opening Balance" name="openingBalance">
									<Input />
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>
		</Drawer>
	);
};

export default AddStudentPresentational;
