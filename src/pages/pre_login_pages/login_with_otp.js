import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useSelector, useDispatch } from 'react-redux';
import { postApi } from 'redux/sagas/postApiDataSaga';
// import { sendPostRequest } from 'redux/sagas/utils';
// import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import './login.scss';

const FormProps = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 24,
	},
};

const LoginWithOTP = () => {
	const loginRedux = useSelector((state) => state.loginRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [otpSent, setOtpSent] = useState(false);
	const [otpForm] = Form.useForm();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	// const otpValue = otpForm.useWatch('otp', form);

	useEffect(() => {
		if (!!loginRedux.token && loginRedux.isLogged) {
			navigate('/organization');
		}
	}, [loginRedux.token, loginRedux.isLogged, navigate]);

	useEffect(() => {
		if (globalRedux.apiStatus.SEND_OTP === 'SUCCESS') {
			dispatch(resetApiStatus('SEND_OTP'));
			setOtpSent(true);
		}
	}, [globalRedux.apiStatus, setOtpSent, dispatch]);

	const sendOTP = async ({ mobile }) => {
		dispatch(postApi({ countryCode: '+91', mobile }, 'SEND_OTP'));
	};

	const verifyOTP = ({ mobile, otp }) => {
		dispatch(postApi({ countryCode: '+91', mobile, otp }, 'VERIFY_OTP'));
	};

	const loading = globalRedux.apiStatus.SEND_OTP === API_STATUS.PENDING || globalRedux.apiStatus.VERIFY_OTP === API_STATUS.PENDING;

	return (
		<Form
			requiredMark={false}
			colon={false}
			layout="vertical"
			labelAlign="left"
			form={otpForm}
			onFinish={otpSent ? verifyOTP : sendOTP}
			{...FormProps}>
			<Form.Item
				label="Mobile"
				name="mobile"
				hasFeedback
				className="hideFormLabel"
				rules={[
					{
						required: true,
						message: 'Please enter your Mobile',
					},
				]}>
				<Input disabled={otpSent} pattern="^-?[0-9]\d*\.?\d*$" placeholder="Mobile" maxLength={10} />
			</Form.Item>
			{otpSent && (
				<Form.Item
					label="OTP"
					name="otp"
					// className="hideFormLabel"
					rules={[
						{
							required: true,
							message: 'OTP is required',
						},
						() => ({
							validator(_, value) {
								if (value?.length < 5) {
									return Promise.reject(`Please fill all`);
								}
								return Promise.resolve();
							},
						}),
					]}>
					<OtpInput
						shouldAutoFocus
						inputStyle={{ width: 44, height: 44, borderColor: '#006fd9', marginRight: 10, borderRadius: 4 }}
						numInputs={5}
						// renderSeparator={<span>-</span>}
						renderInput={(props) => <input {...props} />}
					/>
					{/* <Input pattern="^-?[0-9]\d*\.?\d*$" placeholder="OTP" type="number" maxLength={10} /> */}
				</Form.Item>
			)}
			<Form.Item>
				<Button style={{ width: '100%', fontWeight: 'bold' }} type="primary" htmlType="submit" disabled={loading} loading={loading}>
					{otpSent ? 'Verify OTP' : 'Send OTP'}
				</Button>
			</Form.Item>
		</Form>
	);
};

export default LoginWithOTP;
