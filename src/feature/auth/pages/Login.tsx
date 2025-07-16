import FsButton from './../../../components/Button';
import { MicrosoftLogo } from '@assets/icons/index';
import { Divider, Form } from 'antd';
import FsInput from './../../../components/Input';
import AuthContainer from './AuthContainer';
import { useState } from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';

const SSO_loginUrl = () => {
  const tenantId = import.meta.env.VITE_AZURE_AD_TENANTID;
  const clientId = import.meta.env.VITE_AZURE_AD_CLIENTID;
  const response_type = 'code';
  const redirectUri = `${import.meta.env.VITE_REDIRECT_URL}/auth/redirect`;
  const response_mode = 'query';
  const scope = 'https://graph.microsoft.com/.default';
  const sso_reload = 'true';

  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${response_type}&redirect_uri=${redirectUri}&response_mode=${response_mode}&scope=${scope}&sso_reload=${sso_reload}`;
};
const Login = () => {
  const url = SSO_loginUrl();

  return (
    <AuthContainer>
      <LoginForm />
      <Divider children="OR" />
      <FsButton
        href={url}
        type="default"
        text="Log in with Microsoft"
        textClassName="font-normal text-[14px] leading-[19.6px]"
        className="w-full bg-white rounded-[10px] py-5 gap-4"
        iconPosition="start"
        isIcon={true}
        icon={<MicrosoftLogo width={15} height={15} />}
      />
    </AuthContainer>
  );
};

const LoginForm = () => {
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async () => {
    try {
      setLoading(true);
      const payload = {
        username: loginForm.username.trim(),
        password: loginForm.password.trim(),
      };
      await login.mutateAsync(payload);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  };
  const goToForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  return (
    <Form onFinish={onFinish} layout="vertical" className="w-full">
      <Form.Item
        label="Email or Employee ID"
        name="username"
        rules={[
          {
            required: true,
            message: 'Email/EmployeeId is required',
          },
        ]}
      >
        <FsInput
          type="text"
          name="username"
          value={loginForm.username}
          onChange={handleChange}
          className="py-3 rounded-md border border-gray-300"
          placeholder="Enter Office or Personal Email/ Employee ID"
        />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        className="mb-2"
        rules={[
          {
            required: true,
            message: 'Passsword is required',
          },
        ]}
      >
        <FsInput.Password
          type="password"
          name="password"
          className="py-3 rounded-md border border-gray-300"
          placeholder="Enter your password"
          value={loginForm.password}
          onChange={handleChange}
        />
      </Form.Item>
      <FsButton
        type="link"
        text="Forgot Password?"
        onClick={goToForgotPassword}
        className="p-0 mt-0 mb-1"
        textClassName="text-[#7700c7]"
      />
      <FsButton
        type="primary"
        htmlType="submit"
        text="Log in"
        loading={loading}
        className="w-full  rounded-[10px] py-5 gap-4"
      />
    </Form>
  );
};

export default Login;
