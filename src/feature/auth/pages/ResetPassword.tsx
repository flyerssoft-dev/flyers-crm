import FsButton from '@components/Button';
import FsInput from '@components/Input';
import { Form } from 'antd';
import AuthContainer from './AuthContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/postApi';
import React, { useEffect, useState } from 'react';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token') || '';

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
    }
  }, [token]);

  return (
    <AuthContainer title="Reset Password">
      <ResetPasswordForm navigate={navigate} token={token} />
    </AuthContainer>
  );
};

type ResetPasswordFormProps = {
  navigate: (path: string) => void;
  token: string;
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ navigate, token }) => {
  const [resetForm, setResetForm] = useState({
    temporaryPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        temporaryPassword: resetForm.temporaryPassword.trim(),
        newPassword: resetForm.newPassword.trim(),
        confirmNewPassword: resetForm.confirmNewPassword.trim(),
      };
      const res = await resetPassword(token, payload);
      if (res.data) {
        setLoading(false);
        navigate('/auth/login');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResetForm((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  };

  // Validation rules
  const hasMinLength = resetForm.newPassword.length >= 10;
  const hasUppercase = /[A-Z]/.test(resetForm.newPassword);
  const hasLowercase = /[a-z]/.test(resetForm.newPassword);
  const hasNumber = /\d/.test(resetForm.newPassword);
  const hasSpecialChar = /[@$!%*?&]/.test(resetForm.newPassword);

  const rules = [
    { text: 'Contains at least one uppercase letter (A-Z)', rule: hasUppercase },
    { text: 'Contains at least one lowercase letter (a-z)', rule: hasLowercase },
    { text: 'Includes at least one number (0-9)', rule: hasNumber },
    {
      text: 'Includes at least one special character from the following: @$!%*?&',
      rule: hasSpecialChar,
    },
    { text: 'Minimum length of 10 characters', rule: hasMinLength },
  ];

  const RuleItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <li
      className={`flex items-center text-sm ${isValid ? 'text-green' : ''} transition-colors duration-200`}
    >
      {/* small tick svg icon */}
      <svg
        className="w-4 h-4 mr-2 text-green-500 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
      </svg>
      <span>{text}</span>
    </li>
  );

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      className="w-full"
      initialValues={{
        temporaryPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }}
    >
      <Form.Item
        label="Temporary password"
        name="temporaryPassword"
        rules={[
          {
            required: true,
            message: 'Please enter your temporary password.',
          },
        ]}
        extra="Enter the temporary password received from your email"
      >
        <FsInput
          name="temporaryPassword"
          className="p-2 rounded-md border border-gray-300"
          value={resetForm.temporaryPassword}
          onChange={handleChange}
          placeholder="Enter your temporary password"
        />
      </Form.Item>

      <Form.Item
        label="New password"
        required
        name="newPassword"
        rules={[
          {
            required: true,
            message: 'Please enter a new password',
          },
        ]}
        extra={
          <ul className="space-y-1 list-disc pt-2">
            {rules.map((rule, index) => (
              <RuleItem text={rule.text} isValid={rule.rule} key={index} />
            ))}
          </ul>
        }
      >
        <FsInput.Password
          type="password"
          name="newPassword"
          className="p-2 rounded-md border border-gray-300"
          value={resetForm.newPassword}
          placeholder="Enter your new password"
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item
        label="Confirm new password"
        name="confirmNewPassword"
        rules={[
          {
            required: true,
            message: 'Please re-enter your new password',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match. Please try again.'));
            },
          }),
        ]}
        dependencies={['newPassword']}
      >
        <FsInput
          type="password"
          name="confirmNewPassword"
          className="p-2 rounded-md border border-gray-300"
          placeholder="Re-enter your new password"
          value={resetForm.confirmNewPassword}
          onChange={handleChange}
        />
      </Form.Item>
      <FsButton
        type="primary"
        loading={loading}
        htmlType="submit"
        text="Reset Password"
        textClassName="font-normal text-[14px] leading-[19.6px]"
        className="w-full  rounded-[10px] py-5 gap-4"
      />
    </Form>
  );
};
