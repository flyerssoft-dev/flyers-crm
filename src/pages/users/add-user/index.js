import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button, Form, Select, Drawer, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { sendGetRequest, sendPostRequest } from 'redux/sagas/utils';
import { putApi } from 'redux/sagas/putApiSaga';
import { API_STATUS, NOTIFICATION_STATUS_TYPES, USER_TYPE } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { showToast } from 'helpers';

const { confirm } = Modal;

const AddUser = ({ userAddModal, width = '40%', editUser, setUserAddModal, refreshList, handleClose }) => {
	const [form] = Form.useForm();
	const loginUser = useSelector((state) => state.loginRedux);
	const [registerForm] = Form.useForm();
	const globalRedux = useSelector((state) => state.globalRedux);
	// const mobileValue = Form.useWatch('mobile', form);
	const [registeringUserLoading, setRegisteringUserLoading] = useState(false);
	const [registerModal, setRegisterModal] = useState(false);
	const [userDetailsFromAPI, setUserDetailsFromAPI] = useState(null);
	const dispatch = useDispatch();

	const sendOTP = async (mobile) => {
		registerForm.setFieldsValue({
			mobile,
		});
		try {
			await setRegisterModal(true);
			const response = await sendPostRequest({
				url: `${SERVER_IP}auth/requestotp`,
				body: {
					countryCode: '+91',
					mobile: mobile,
				},
			});
			if (response?.data?.type === 'success') {
			}
		} catch (error) {
			setRegisterModal(false);
		}
	};

	const showConfirm = (data = null, mobile) => {
		if (data) {
			confirm({
				title: 'User Found!!',
				icon: <ExclamationCircleOutlined />,
				content: (
					<div>
						<div>
							We have find{' '}
							<span style={{ fontWeight: 'bold' }}>
								{data?.firstName} {data?.lastName}
							</span>{' '}
							profile related to this number.. Are you sure to use this data?
						</div>
					</div>
				),
				onOk() {
					if (data) {
						// form.setFieldsValue({
						// 	firstName: data?.firstName,
						// 	lastName: data?.lastName,
						// 	email: data?.email,
						// });
					}
				},
				onCancel() {},
			});
		} else {
			confirm({
				title: 'User Not Found!!',
				icon: <ExclamationCircleOutlined />,
				content: (
					<div>
						<div>
							We do not find any data related to this number <span style={{ fontWeight: 'bold' }}>{mobile}</span>. Do you want to
							Register the User? Click Ok to send the OTP and Get Verified Instantly.
						</div>
					</div>
				),
				onOk() {
					sendOTP(mobile);
					// setUserAddModal(false);
				},
				onCancel() {},
			});
		}
	};

	// useEffect(() => {
	// 	if (editUser) {
	// 		form.setFieldsValue({
	// 			accessLevel: editUser?.accessLevel || USER_TYPE[1],
	// 			mobile: editUser?.mobile,
	// 		});
	// 	} else {
	// 		form?.resetFields();
	// 	}
	// }, [editUser, form]);

	useEffect(() => {
		if (!userAddModal) {
			form?.resetFields();
		}
		if (!registerModal) {
			registerForm?.resetFields();
		}
	}, [userAddModal, registerModal, form, registerForm]);

	const handleRegisterUser = async (values) => {
		let data = {
			countryCode: '+91',
			mobile: values?.mobile || '',
			firstName: values?.firstName,
			lastName: values?.lastName,
			otp: values?.otp,
		};
		try {
			await setRegisteringUserLoading(true);
			const response = await sendPostRequest({
				url: `${SERVER_IP}auth/verifyuserotp`,
				body: data,
			});
			await setRegisteringUserLoading(false);
			if (response?.data?.type === 'success') {
				handleSubmit({
					accessLevel: values?.accessLevel || '',
					registeredUserId: response?.data?.id,
				});
			}
			if (response?.data?.type === 'error') {
				showToast('Failed!', response?.data?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
			}
		} catch (error) {
			await setRegisteringUserLoading(false);
		}
	};

	const handleSubmit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?.id,
			userId: loginUser?.id,
			accessLevel: values?.accessLevel || USER_TYPE[1],
			staffId: userDetailsFromAPI?._id || values?.registeredUserId,
		};

		if (!editUser) {
			dispatch(postApi(data, 'ADD_USER'));
		} else {
			let url = `${SERVER_IP}user/${editUser._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_CUSTOMER', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_USER === 'SUCCESS' || globalRedux.apiStatus.EDIT_CUSTOMER === 'SUCCESS') {
			dispatch(resetApiStatus(editUser ? 'EDIT_CUSTOMER' : 'ADD_USER'));
			refreshList?.();
			handleClose?.();
			setRegisterModal(false);
			form?.resetFields();
		}
	}, [globalRedux.apiStatus, editUser, setUserAddModal, dispatch, refreshList, handleClose, form]);

	const handleSearch = async (searchString) => {
		if (searchString?.length === 10) {
			const hide = message.loading('searching user..', 0, () => {
				// message.success('loading had closed');
			});
			try {
				const { data } = await sendGetRequest(null, `${SERVER_IP}user/mobile/${searchString}`);
				hide();
				setUserDetailsFromAPI(data);
				showConfirm(data, searchString);
			} catch (error) {
				hide();
			}
		}
	};

	const debounceFn = debounce(handleSearch, 1000);

	const layer1FormCol = {
		labelCol: {
			span: 12,
		},
		wrapperCol: {
			span: 12,
		},
	};

	const loading = globalRedux.apiStatus.ADD_USER === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_CUSTOMER === API_STATUS.PENDING;

	return (
		<>
			<Modal
				title={`Register User`}
				closable={false}
				open={registerModal}
				onOk={registerForm.submit}
				onCancel={() => setRegisterModal(false)}
				okButtonProps={{ loading: registeringUserLoading }}>
				<Row>
					<Form
						name="register-user"
						className="required_in_right"
						style={{ width: '100%' }}
						colon={false}
						labelAlign="left"
						form={registerForm}
						onFinish={handleRegisterUser}
						initialValues={{
							accessLevel: USER_TYPE[1],
						}}
						{...layer1FormCol}>
						<Form.Item
							label="Access Level"
							name="accessLevel"
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}>
							<Select placeholder="select user type">
								{USER_TYPE.map((type) => (
									<Select.Option key={type} value={type}>
										{type}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							label="First Name"
							name="firstName"
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="Last Name"
							name="lastName"
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}>
							<Input />
						</Form.Item>
						<Form.Item label="Mobile" name="mobile">
							<Input disabled />
						</Form.Item>
						<Form.Item
							label="OTP"
							name="otp"
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}>
							<Input maxLength={6} />
						</Form.Item>
					</Form>
				</Row>
			</Modal>
			<Drawer
				placement="right"
				title={`${editUser ? 'Edit' : 'New'} User`}
				width={width || '40%'}
				open={userAddModal}
				// closable
				onClose={() => setUserAddModal(false)}
				destroyOnHidden>
				<Row>
					<Col span={24}>
						<Row style={{ marginTop: 0 }}>
							<Form
								name="add-user"
								className="required_in_right"
								style={{ width: '100%' }}
								colon={false}
								labelAlign="left"
								form={form}
								onFinish={handleSubmit}
								initialValues={{
									accessLevel: USER_TYPE[1],
								}}
								{...layer1FormCol}>
								<Form.Item
									label="Access Level"
									name="accessLevel"
									rules={[
										{
											required: true,
											message: 'This Field is required!',
										},
									]}>
									<Select placeholder="select user type">
										{USER_TYPE.map((type) => (
											<Select.Option key={type} value={type}>
												{type}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
								<Form.Item
									label="Mobile"
									name="mobile"
									rules={[
										{
											required: true,
											message: 'This Field is required!',
										},
									]}>
									<div>
										<Input
											onKeyPress={(event) => {
												if (!/[0-9]/.test(event.key)) {
													event.preventDefault();
												}
											}}
											maxLength={10}
											onChange={(e) => debounceFn(e?.target.value)}
										/>
										{userDetailsFromAPI?._id && (
											<div>
												<span style={{}}>Selected user: </span>
												<span style={{ fontWeight: 'bold', color: '#25b394' }}>
													{userDetailsFromAPI?.firstName} {userDetailsFromAPI?.lastName}
												</span>
											</div>
										)}
									</div>
								</Form.Item>
								<Form.Item
									wrapperCol={{
										offset: 0,
										span: 24,
									}}>
									<Row className="space-between" style={{ paddingTop: 20, width: '100%', margin: 0 }}>
										<Button danger style={{ width: '49%' }} onClick={() => setUserAddModal(false)}>
											Cancel
										</Button>
										<Button
											loading={loading}
											style={{ width: '49%' }}
											type="primary"
											htmlType="submit"
											disabled={!userDetailsFromAPI?._id}>
											{editUser ? 'Update' : 'Save'}
										</Button>
									</Row>
								</Form.Item>
							</Form>
						</Row>
					</Col>
				</Row>
			</Drawer>
		</>
	);
};

export default AddUser;
