import { Route, Routes } from 'react-router-dom';
import { ForgotPassword, Login, RedirectPage, ResetPassword } from './../pages';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="redirect" element={<RedirectPage />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default AuthRoutes;
