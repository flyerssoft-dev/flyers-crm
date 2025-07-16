import { notify } from '@/utils/notify';
import useAuthStore from '../feature/auth/store/useAuthStore';
import useMenuStore from '@store/useMenuStore';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  hideSuccessNotify?: boolean;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { accesstoken, userRole } = useAuthStore.getState();
    if (accesstoken) {
      config.headers.Authorization = `Bearer ${accesstoken}`;
    }
    if (userRole) {
      config.headers['role'] = userRole; // Add the role to the headers
    }
    return config;
  },
  (error) => Promise.reject(error),
);
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle success notify for POST, PUT, PATCH and DELETE
    const { method, hideSuccessNotify } = (response.config as CustomAxiosRequestConfig) || {};
    if (
      // we can use hideSuccessNotify flag to hide success notify
      !hideSuccessNotify &&
      method &&
      ['post', 'put', 'delete', 'patch'].includes(method.toLowerCase()) &&
      [200, 201].includes(response.status)
    ) {
      const successMessage = response.data?.message || 'Action completed successfully';
      notify.success({
        description: String(successMessage),
      });
    }
    return response;
  },
  async (error) => {
    const { refreshToken, setAccessToken, clearTokens, isLoggedWithSSO } = useAuthStore.getState();
    const { reset } = useMenuStore.getState();
    const originalRequest = error.config;
    const errorResponseStatus = error.response?.status;
    if (!error.response) {
      notify.error({
        description: 'Network error. Please check your connection.',
      });
      return Promise.reject(error);
    }

    if (errorResponseStatus === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-login`,
          {
            token: refreshToken,
          },
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        );
        const { accessToken } = response.data.data || {};
        setAccessToken(accessToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      } catch (refreshError) {
        const isSSOLogin = isLoggedWithSSO;
        reset();
        clearTokens();
        if (isSSOLogin) {
          window.location.href = `https://login.microsoftonline.com/${
            import.meta.env.VITE_AZURE_AD_TENANTID
          }/oauth2/v2.0/logout?post_logout_redirect_uri=${
            import.meta.env.VITE_REDIRECT_URL
          }/auth/login`;
        }
        return Promise.reject(refreshError);
      }
    }
    // Handle 403 Forbidden - force logout and redirect to login
    if (errorResponseStatus === 403) {
      // Show error notification
      const errorDescription = error.response?.data?.message || 'Access Denied';
      notify.error({
        description: String(errorDescription),
      });

      reset();
      clearTokens();

      // Handling SSO logout
      if (isLoggedWithSSO) {
        // making delay of logout screen to show forbidden reason popup
        window.location.href = `https://login.microsoftonline.com/${
          import.meta.env.VITE_AZURE_AD_TENANTID
        }/oauth2/v2.0/logout?post_logout_redirect_uri=${
          import.meta.env.VITE_REDIRECT_URL
        }/auth/login`;
      }
    }
    // for error notification
    if (errorResponseStatus === 400 || errorResponseStatus === 500) {
      const errorDescription = error.response?.data?.message || 'Something went wrong';
      notify.error({
        description: String(errorDescription),
      });
    }

    // Handle other error status codes that were not caught above
    if (![401, 403, 400, 500].includes(errorResponseStatus)) {
      const errorDescription = error.response?.data?.message || 'An unexpected error occurred';
      notify.error({
        description: errorDescription,
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
