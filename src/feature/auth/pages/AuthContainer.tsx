import { LOGIN_DATA } from '@constants/index';
import { FlyersLogo } from '@assets/icons/index';

const AuthContainer = ({
  children,
  title = LOGIN_DATA.Login,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <div className="h-screen col justify-center items-center bg-login-bg bg-cover bg-center">
      <div className="bg-table lg:w-[25%] w-[35%]  min-w-fit p-6 rounded-[16px] shadow-lg bg-login-bg ">
        <div className="flex-col flex items-center justify-center h-[90%] gap-5">
          <div className="flex items-center justify-center pt-7 ">
            <FlyersLogo fill="#7700C7" />
          </div>
          <p className="font-bold text-xl leading-[33.6px] pt-5 pb-3 2xl:text-2xl ">{title}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
