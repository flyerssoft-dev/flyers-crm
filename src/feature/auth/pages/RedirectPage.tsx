import { useEffect } from 'react';
import useAuthStore from '@feature/auth/store/useAuthStore';
import { useAuth } from '../hooks';

const RedirectPage = () => {
  const { getAccessToken, getUserData, getRefreshToken, userData } = useAuthStore();
  const { loginWithSSO } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const code: string | null = searchParams.get('code');

  const fetchData = async () => {
    try {
      loginWithSSO.mutate(code);
    } catch (error) {
      console.log(error, 'err');
    }
  };

  useEffect(() => {
    if (code && getAccessToken() === null && getUserData() === null && getRefreshToken() === null) {
      fetchData();
    } else if (code && userData === null) {
      fetchData();
    }
  }, [code]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className=" flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800">'Redirecting...'</h1>
        <p className="text-lg text-gray-600">'You will be redirected in a few seconds...'</p>
      </div>
    </div>
  );
};

export default RedirectPage;
