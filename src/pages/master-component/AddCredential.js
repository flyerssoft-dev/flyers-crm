import React, { useEffect } from 'react';
import { Input, Button, Divider, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { postApi } from '../../redux/sagas/postApiDataSaga';
import { API_STATUS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { resetApiStatus } from '../../redux/reducers/globals/globalActions';

const AddCredential = ({ handleClose, editCredential, setCredentialAddModal }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);
	const users = useSelector((state) => globalRedux?.users);

	const addCredential = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?._id,
		};
		dispatch(postApi(data, 'ADD_CREDENTIAL'));
	};

	const handleEdit = (values) => {
		let data = { ...values };
		const url = `${SERVER_IP}credential/${editCredential._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(putApi(data, 'EDIT_CREDENTIAL', url));
	};

	useEffect(() => {
		if (
			globalRedux.apiStatus.ADD_CREDENTIAL === 'SUCCESS' ||
			globalRedux.apiStatus.EDIT_CREDENTIAL === 'SUCCESS'
		) {
			dispatch(resetApiStatus(editCredential ? 'EDIT_CREDENTIAL' : 'ADD_CREDENTIAL'));
			setCredentialAddModal(false);
			handleClose();
		}
	}, [globalRedux.apiStatus, editCredential, handleClose, setCredentialAddModal, dispatch]);

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

	const loading =
		globalRedux.apiStatus.ADD_CREDENTIAL === API_STATUS.PENDING ||
		globalRedux.apiStatus.EDIT_CREDENTIAL === API_STATUS.PENDING;

	return (
		<div style={{ backgroundColor: '#fff', padding: '20px' }}>
			<h3 style={{ marginBottom: '10px' }}>{editCredential ? 'Edit' : 'New'} Credential</h3>
			<Divider />

			<Form
				form={form}
				name="add-credential"
				labelAlign="left"
				colon={false}
				onFinish={editCredential ? handleEdit : addCredential}
				{...layout}
			>
				<Form.Item
					label="Credential Name"
					name="credName"
					initialValue={editCredential?.credName}
					rules={[{ required: true, message: 'This Field is required!' }]}
				>
					<Input placeholder="Enter credential name" />
				</Form.Item>

				<Form.Item
					label="User Name"
					name="userName"
					initialValue={editCredential?.userName}
					rules={[{ required: true, message: 'This Field is required!' }]}
				>
					<Input placeholder="Enter username" />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					initialValue={editCredential?.password}
					rules={[{ required: true, message: 'This Field is required!' }]}
				>
					<Input.Password placeholder="Enter password" />
				</Form.Item>

				<Form.Item
					label="Auth Key"
					name="authkey"
					initialValue={editCredential?.authkey}
					rules={[{ required: true, message: 'This Field is required!' }]}
				>
					<Input placeholder="Enter authentication key" />
				</Form.Item>

				<Form.Item
					label="URL"
					name="url"
					initialValue={editCredential?.url}
					rules={[{ required: true, message: 'This Field is required!' }]}
				>
					<Input placeholder="Enter target URL" />
				</Form.Item>

				<Form.Item
					label="Assigned Users"
					name="assignedUsers"
					initialValue={editCredential?.assignedUsers}
					rules={[{ required: true, message: 'This Field is required!' }]}
				>
					<Select mode="multiple" placeholder="Select assigned users">
						{users?.map((user) => (
							<Select.Option key={user?.userId} value={user?.userId}>
								{`${user?.firstName} ${user?.lastName}`}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 6, span: 18 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Button danger style={{ width: '48%' }} onClick={() => setCredentialAddModal(false)}>
							Cancel
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							style={{ width: '48%' }}
							loading={loading}
						>
							{editCredential ? 'Update' : 'Save'}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	);
};

export default AddCredential;
