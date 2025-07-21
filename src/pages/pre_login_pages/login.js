import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col, Tabs, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { LogoComponent } from 'components/side-bar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import LoginWithOTP from './login_with_otp';
import './login.scss';
import { getApi } from 'redux/sagas/getApiDataSaga';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const FormProps = {
	wrapperCol: { span: 24 },
};

const Login = () => {
	const [form] = Form.useForm();
	const loginRedux = useSelector((state) => state.loginRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const navigate = useNavigate();
	const dispatch = useDispatch();


	useEffect(() => {
		if (!!loginRedux.accessToken && loginRedux.isLogged && !globalRedux?.selectedOrganization?._id) {
			dispatch(getApi('ME_API'))
			navigate('/organization');
		}
	}, [loginRedux.token, loginRedux.isLogged, globalRedux?.selectedOrganization?._id, navigate]);

	const login = (data) =>{ 
		dispatch(postApi(data, 'LOGIN'))
	};

	return (
		<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="login-container">
			<Row style={{ height: '100vh', width: '100%' }}>
				<Col xl={14} md={12} sm={0} xs={0} className="login-slider">
					<Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 2500 }} loop className="login-swiper" pagination={{ enabled: false }}>
						<SwiperSlide>
							<div className="slider-content">
								<img src="https://accounts.zoho.com/v2/components/images/passwordless_illustration2x.png" alt="Slide 1" />
								<Title level={3}>Passwordless Login</Title>
								<Text>Experience secure, password-free access to your account.</Text>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="slider-content">
								<img src="https://accounts.zoho.com/v2/components/images/mfa_illustration2x.png" alt="Slide 2" />
								<Title level={3}>Multi-Factor Authentication</Title>
								<Text>Protect your account with additional security layers.</Text>
							</div>
						</SwiperSlide>
					</Swiper>
				</Col>

				<Col xl={10} md={12} xs={24} className="login-form-area">
					<Row justify="center" align="middle" style={{ height: '100%', width: '80%' }}>
						<Col span={24}>
							<LogoComponent style={{ fontSize: 30 }} />
							<Title level={2} style={{ marginTop: 20 }}>
								Welcome <span style={{ color: '#006fd9' }}>back!</span>
							</Title>
							<Text type="secondary">Enter your details to continue.</Text>

							<Tabs defaultActiveKey="LOGIN_WITH_PASSWORD" style={{ marginTop: 30 }}>
								{/* <TabPane tab="Login with OTP" key="LOGIN_WITH_OTP">
									<LoginWithOTP />
								</TabPane> */}
								<TabPane tab="Login with Password" key="LOGIN_WITH_PASSWORD">
									<Form form={form} layout="vertical" onFinish={login} {...FormProps}>
										<Form.Item label="Email or Employee ID" name="username" rules={[{ required: true, message: 'Please enter your Mobile' }]}>
											<Input placeholder="Email Office or Personal Email/Employee ID"/>
										</Form.Item>
										<Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your Password' }]}>
											<Input.Password placeholder="Password" visibilityToggle />
										</Form.Item>
										<Form.Item>
											<Button type="primary" htmlType="submit" loading={globalRedux.apiStatus.LOGIN === 'PENDING'} style={{ width: '100%', fontWeight: 'bold' }}>
												LOGIN
											</Button>
										</Form.Item>
									</Form>
								</TabPane>
							</Tabs>
						</Col>
					</Row>
				</Col>
			</Row>
		</motion.div>
	);
};

export default Login;
