import React, { useCallback } from 'react';
import moment from 'moment';
import { Button, Select, Modal, Drawer, Row, Col, Input, Form } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DATE_FORMAT, PRIORITIES } from 'constants/app-constants';
import ProjectModal from 'components/project-modal';
import DatePicker from 'components/date-picker';

const { confirm } = Modal;

const layer1FormCol = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 12,
	},
};

const AddTaskPresentational = ({ state, setState, handleSubmit, loading, editData, form, users }) => {
	const showConfirm = useCallback(() => {
		confirm({
			title: 'Do you want to close this window?',
			icon: <ExclamationCircleOutlined />,
			content: 'You will be lost all the details you have entered here.',
			onOk() {
				setState((state) => ({ ...state, visible: false }));
			},
			onCancel() {},
		});
	}, [setState]);

	return (
		<Drawer
			maskClosable={false}
			title={`${editData ? 'Edit' : 'Create'} Task`}
			placement="right"
			width={'30%'}
			open={state?.visible}
			destroyOnHidden
			className="add_task"
			onClose={showConfirm}
			footer={
				<Row>
					<Col
						xl={{
							span: 12,
							offset: 12,
						}}
						md={12}>
						<Row gutter={[10, 10]} style={{ width: '100%' }} justify="end">
							<Col>
								<Button onClick={() => setState({ ...state, visible: false })}>Cancel</Button>
							</Col>
							<Col>
								<Button loading={loading} type="primary" htmlType="submit" onClick={() => form.submit()}>
									{`${editData ? 'Update' : 'Submit'}`}
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			}>
			<Row>
				<Col span={24}>
					<Row style={{ marginTop: 0 }}>
						<Form
							name="add-customer"
							className="required_in_right"
							style={{ width: '100%' }}
							colon={false}
							labelAlign="left"
							form={form}
							onFinish={handleSubmit}
							{...layer1FormCol}>
							<Form.Item
								label="Project"
								name="projectId"
								getValueFromEvent={(data) => data}
								rules={[
									{
										required: true,
										message: 'This Field is required!',
									},
								]}>
								<ProjectModal />
							</Form.Item>
							<Form.Item
								label="Task Name"
								name="taskName"
								rules={[
									{
										required: true,
										message: 'This Field is required!',
									},
								]}>
								<Input placeholder="Task Name" />
							</Form.Item>
							<Form.Item
								label="Due date"
								name="dueDate"
								initialValue={moment()}
								rules={[
									{
										required: false,
										message: 'This Field is required!',
									},
								]}>
								<DatePicker format={DATE_FORMAT.DD_MM_YYYY} style={{ width: '100%' }} placeholder="enter due date" />
							</Form.Item>
							{/* <Form.Item
								label="Assigned To"
								name="assignedUsers"
								rules={[
									{
										required: true,
										message: 'This Field is required!',
									},
								]}>
								<Select mode="multiple" placeholder="select assigned users">
									{users?.map((user) => (
										<Select.Option value={user?._id}>{`${user?.firstName} ${user?.lastName}`}</Select.Option>
									))}
								</Select>
							</Form.Item> */}
							<Form.Item
								label="Priority"
								name="priority"
								rules={[
									{
										required: true,
										message: 'This Field is required!',
									},
								]}>
								<Select placeholder="Select Priority">
									{PRIORITIES?.map((priority) => (
										<Select.Option key={priority} value={priority}>
											{priority}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item label="Description" name="description">
								<Input.TextArea />
							</Form.Item>
						</Form>
					</Row>
				</Col>
			</Row>
		</Drawer>
	);
};

export default AddTaskPresentational;
