import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { postApi } from 'redux/sagas/postApiDataSaga';
import LottieComponent from 'components/lottie-component';
import LottieFile from 'assets/lottie-files';
import { LogoComponent } from 'components/side-bar';

const Register = () => {
	const [form] = Form.useForm();
	// const registerRedux = useSelector((state) => state.registerRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const FormProps = {
		labelCol: {
			span: 24,
		},
		wrapperCol: {
			span: 24,
		},
	};

	// useEffect(() => {
	// 	if (!!registerRedux?.token && registerRedux?.isLogged) {
	// 		navigate?.('/organization');
	// 	}
	// }, [registerRedux?.token, registerRedux?.isLogged, navigate]);

	useEffect(() => {
		if (globalRedux?.apiStatus.REGISTER === 'SUCCESS') {
			navigate('/login');
		}
	}, [globalRedux?.apiStatus, navigate]);

	const register = (data) => {
		delete data.confirmPassword;
		const request = {
			...data,
			device: 'web',
		};
		dispatch(postApi(request, 'REGISTER'));
	};

	const isLoading = globalRedux.apiStatus.REGISTER === 'PENDING';

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
						<Col xl={24} style={{ paddingTop: 20 }}>
							<Form
								requiredMark={false}
								colon={false}
								layout="vertical"
								labelAlign="left"
								form={form}
								onFinish={register}
								{...FormProps}>
								<Form.Item
									requiredMark={false}
									colon={false}
									label="First Name"
									name="firstName"
									rules={[
										{
											required: true,
											message: 'This Field is Required!',
										},
									]}>
									<Input />
								</Form.Item>
								<Form.Item
									label="Last Name"
									name="lastName"
									rules={[
										{
											required: false,
											message: 'This Field is Required!',
										},
									]}>
									<Input />
								</Form.Item>
								<Form.Item
									label="Email"
									name="email"
									rules={[
										{
											required: true,
											message: 'Please Enter Your Email',
										},
									]}>
									<Input />
								</Form.Item>
								<Form.Item
									label="Mobile"
									name="mobile"
									rules={[
										{
											required: true,
											message: 'Please Enter Your Mobile',
										},
									]}>
									<Input />
								</Form.Item>

								<Form.Item
									label="Password"
									name="password"
									rules={[
										{
											required: true,
											message: 'Please Enter Your Password!',
										},
									]}>
									<Input.Password visibilityToggle />
								</Form.Item>
								<Form.Item
									label="Confirm Password"
									name="confirmPassword"
									dependencies={['password']}
									rules={[
										{
											required: true,
											message: 'Please confirm your password!',
										},
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue('password') === value) {
													return Promise.resolve();
												}
												return Promise.reject(new Error('The two passwords that you entered do not match!'));
											},
										}),
									]}>
									<Input.Password visibilityToggle />
								</Form.Item>
								<Form.Item>
									<Button style={{ width: '100%' }} type="primary" htmlType="submit" disabled={isLoading} loading={isLoading}>
										Register
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
								<Col>
									<Row>
										<Link className="nav-link" to="/login" style={{ fontSize: '12px', textAlign: 'right' }}>
											Already User?
										</Link>
										<br />
									</Row>
								</Col>
							</Row>
						</Col>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default Register;
