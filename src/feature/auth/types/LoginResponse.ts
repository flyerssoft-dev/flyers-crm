import { userDataProps } from '../../../types/userTypes';

export interface LoginResponse {
  message: string;
  data: userDataProps;
  accessToken: string;
  refreshToken: string;
}
