import { LoginResponse } from '@feature/auth/types/LoginResponse';
import axiosInstance from '@/utils/axiosInstance';

type ResetPassword = {
  token?: string | null;
  temporaryPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type LoginCredentails = {
  username: string;
  password: string;
};

const basePath = `/auth`;

export const loginWithSSO = (code: string | null) => {
  const loginApi = axiosInstance.post<LoginResponse>(`${basePath}/microsoft-sso`, {
    code,
  });
  return loginApi;
};

export const loginWithCredentials = (data: LoginCredentails) => {
  const loginApi = axiosInstance.post<LoginResponse>(`${basePath}/login`, data);
  return loginApi;
};

export const resetPassword = (
  token: ResetPassword['token'] = '',
  { newPassword, confirmNewPassword, temporaryPassword }: ResetPassword,
) => {
  const body = {
    temporaryPassword,
    newPassword,
    confirmNewPassword,
  };
  const resetPasswordData = axiosInstance.post(`${basePath}/reset-password/?token=${token}`, body);
  return resetPasswordData;
};

export const forgotPassword = (email: string) => {
  const forgotPassword = axiosInstance.post(`${basePath}/forgot-password`, {
    email,
  });
  return forgotPassword;
};
