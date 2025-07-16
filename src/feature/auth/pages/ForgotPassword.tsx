import React, { useState } from 'react';
import AuthContainer from './AuthContainer';
import FsInput from './../../../components/Input';
import { Form } from 'antd';
import FsButton from './../../../components/Button';
import { forgotPassword } from '../api/postApi';
import { notify } from '@/utils/notify';

export const ForgotPassword: React.FC = () => {
  return (
    <AuthContainer title="Forgot Password">
      <ForgotPasswordForm />
    </AuthContainer>
  );
};

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm(); // Add this line to create a form instance

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const resetForm = () => {
    setEmail('');
    form.resetFields();
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!emailRegex.test(email)) {
      setLoading(false);
      notify.error({
        description: 'Please enter a valid email address.',
      });
      return;
    }
    try {
      const res = await forgotPassword(email.trim());
      if (res.data) {
        setLoading(false);
        // Clear the email state and reset the form
        resetForm();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} className="w-full" layout="vertical">
      <Form.Item
        name="email"
        onReset={() => setEmail('')}
        label="Email"
        rules={[
          {
            required: true,
            message: 'Email is required',
          },
        ]}
        extra="We will send you a recovery email to reset your password"
      >
        <FsInput
          type="email"
          name="email"
          className="p-2 rounded-md border border-gray-300"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
        />
      </Form.Item>
      <FsButton
        type="primary"
        loading={loading}
        disabled={!email}
        htmlType="submit"
        text="Send Recovery Email"
        textClassName="font-normal text-[14px] leading-[19.6px]"
        className="w-full  rounded-[10px] py-5 gap-4"
      />
    </Form>
  );
};
