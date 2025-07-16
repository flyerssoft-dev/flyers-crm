import React from 'react';
import { Button, Form, Modal, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { STATUS_DROPDOWN } from 'constants/app-constants';

// const ticketStatusTypes = ['Open', 'Assigned', 'Accepted', 'In Progress', 'Completed', 'Cancelled', 'Pending'];

const AssignToModal = ({ users, rowSelection, refreshList }) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const organizationId = globalRedux.selectedOrganization._id;
	const dispatch = useDispatch();

	const [visible, setVisible] = React.useState(false);
	const [statusVisible, setStatusVisible] = React.useState(false);
	const [form] = Form.useForm();

	const handleSubmit = (values) => {
		const request = rowSelection?.selectedRowKeys?.map((ticketId, index) => ({ ticketId })) ?? [];
		let url = `${SERVER_IP}ticket/assign?orgId=${organizationId}&assignedTo=${values?.assignTo}`;
		dispatch(postApi({ selectedTickets: request }, 'ADD_ASSIGNEE', url));
	};

	const handleStatusSubmit = (values) => {
		const request = rowSelection?.selectedRowKeys?.map((ticketId, index) => ({ ticketId })) ?? [];
		let url = `${SERVER_IP}ticket/status?orgId=${organizationId}`;
		dispatch(postApi({ selectedTickets: request, ticketStatus: values?.status }, 'ADD_TICKET_STATUS', url));
	};

	React.useEffect(() => {
		if (globalRedux.apiStatus.ADD_ASSIGNEE === 'SUCCESS') {
			setVisible(false);
			refreshList();
			dispatch(resetApiStatus('ADD_ASSIGNEE'));
		}
	}, [globalRedux.apiStatus, refreshList, dispatch]);

	React.useEffect(() => {
		if (globalRedux.apiStatus.ADD_TICKET_STATUS === 'SUCCESS') {
			setStatusVisible(false);
			refreshList();
			dispatch(resetApiStatus('ADD_TICKET_STATUS'));
		}
	}, [globalRedux.apiStatus, dispatch, refreshList]);

	if (rowSelection?.selectedRowKeys?.length === 0) return null;

	return (
		<>
			<Button onClick={() => setVisible(true)} style={{ marginLeft: 10 }} type="primary">
				Assign
			</Button>
			<Button onClick={() => setStatusVisible(true)} style={{ marginLeft: 10 }} type="primary">
				Update Status
			</Button>
			<Modal
				// okButtonProps={{ form: 'category-editor-form', key: 'submit', htmlType: 'submit' }}
				onOk={form.submit}
				onCancel={() => setVisible(false)}
				open={visible}
				width={'30%'}
				okText="Submit">
				<Form form={form} requiredMark={false} colon={false} id="category-editor-form" layout="vertical" onFinish={handleSubmit}>
					<Form.Item
						label="Assign To"
						name="assignTo"
						rules={[
							{
								required: true,
								message: 'Please Select One!',
							},
						]}>
						<Select placeholder="User">
							{users?.map((user) => (
								<Select.Option key={user?._id} value={user?.userId}>
									{user?.firstName || '-'} {user?.lastName || '-'}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				// okButtonProps={{ form: 'category-editor-form', key: 'submit', htmlType: 'submit' }}
				onOk={form.submit}
				onCancel={() => setStatusVisible(false)}
				open={statusVisible}
				width={'20%'}
				okText="Submit">
				<Form form={form} requiredMark={false} colon={false} id="category-editor-form" layout="vertical" onFinish={handleStatusSubmit}>
					<Form.Item
						label="Ticket Status"
						name="status"
						rules={[
							{
								required: true,
								message: 'Please Select One!',
							},
						]}>
						<Select placeholder="Select Status">
							{STATUS_DROPDOWN?.map((value) => (
								<Select.Option key={value} value={value}>
									{value}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default AssignToModal;
