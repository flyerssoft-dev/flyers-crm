import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import loginImg from 'assets/images/login1.jpg';
import { LogoComponent } from 'components/side-bar';
import LottieComponent from 'components/lottie-component';
import LottieFile from 'assets/lottie-files';
import { SERVER_IP } from 'assets/Config';
import { putApi } from 'redux/sagas/putApiSaga';
import { setProfileUpdatedStatus } from 'redux/reducers/login/loginActions';

const FormProps = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 24,
	},
};

const CompleteYourProfile = () => {
	const [form] = Form.useForm();
	const loginRedux = useSelector((state) => state.loginRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!loginRedux.isLogged) {
			navigate('/login');
		}
	}, [loginRedux.isLogged, navigate]);

	useEffect(() => {
		if (!!loginRedux.token && loginRedux.isProfileUpdated) {
			navigate('/organization');
		}
	}, [loginRedux.token, loginRedux.isProfileUpdated, navigate]);

	useEffect(() => {
		if (globalRedux.apiStatus.COMPLETE_PROFILE === 'SUCCESS') {
			const profileData = form.getFieldsValue();
			dispatch(setProfileUpdatedStatus(profileData));
		}
	}, [globalRedux.apiStatus, form, dispatch]);

	const completeProfile = (data) => {
		let url = `${SERVER_IP}user/${loginRedux?.id}`;
		dispatch(putApi(data, 'COMPLETE_PROFILE', url));
	};

	return (
		<Row className="login_container" style={{ height: '100vh', backgroundColor: '#fff' }}>
			<Col xl={12} md={12} className="login_image">
				<div style={{ fontWeight: 'bold', fontSize: 30, color: '#000', paddingBottom: 30 }}>
					Welcome to Zopay<span style={{ color: '#006fd9', paddingLeft: 5 }}>Books</span>
				</div>
				<div style={{ fontWeight: 'bold', fontSize: 30, color: '#000', padding: '0 20px', textAlign: 'center' }}>
					#1 All in one application for In office, Mobile and Remote Team.
				</div>
				<div style={{ fontWeight: 'bold', fontSize: 20, color: '#000', padding: '0 20px', textAlign: 'center' }}>
					Sync all your Tickets, Invoices, Projects and Tasks in One App.
				</div>
				<LottieComponent file={LottieFile.Analytics} height="80%" />
			</Col>
			<Col xl={12} md={12}>
				<Row justify="center" align="middle" style={{ height: '100%' }}>
					<Col xl={12} md={12}>
						<LogoComponent style={{ fontSize: 30 }} />
						<Col span={24}>
							<div style={{ fontWeight: 'bold', fontSize: 30, color: '#000' }}>
								Welcome <span style={{ color: '#006fd9' }}>back!</span>
							</div>
							<div style={{ color: 'lightgray' }}>Welcome back! Please enter your details.</div>
						</Col>
						<Col xl={24} style={{ paddingTop: 20, height: '30vh' }}>
							<Form
								requiredMark={false}
								colon={false}
								layout="vertical"
								labelAlign="left"
								form={form}
								onFinish={completeProfile}
								{...FormProps}>
								<Form.Item
									label="FirstName"
									name="firstName"
									className="hideFormLabel"
									rules={[
										{
											required: true,
											message: 'Please enter your First Name',
										},
									]}>
									<Input placeholder="First Name" />
								</Form.Item>
								<Form.Item
									label="Last Name"
									name="lastName"
									className="hideFormLabel"
									rules={[
										{
											required: true,
											message: 'Please enter your Last Name',
										},
									]}>
									<Input placeholder="Last Name" />
								</Form.Item>
								<Form.Item
									label="Email"
									name="email"
									className="hideFormLabel"
									rules={[
										{
											required: false,
											message: 'Please enter your Email',
										},
									]}>
									<Input placeholder="Email" />
								</Form.Item>
								<Form.Item>
									<Button
										style={{ width: '100%', fontWeight: 'bold' }}
										type="primary"
										htmlType="submit"
										disabled={globalRedux.apiStatus.LOGIN === 'COMPLETE_PROFILE'}
										loading={globalRedux.apiStatus.LOGIN === 'COMPLETE_PROFILE'}>
										Complete Profile
									</Button>
								</Form.Item>
							</Form>
							<Row>
								<Col>
									<Row>
										{/* <Link className="nav-link" to="/forgot-password" style={{ fontSize: '12px' }}>
														Forgot Password?
													</Link> */}
										<br />
									</Row>
								</Col>
								{/* <Col>
									<Row>
										<Link className="nav-link" to="/register" style={{ fontSize: '12px', textAlign: 'right' }}>
											New User?
										</Link>
									</Row>
								</Col> */}
							</Row>
						</Col>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default CompleteYourProfile;
