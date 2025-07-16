import { useEffect, useRef, useState } from 'react';
import { HELLO, HR_TEAM, WELCOME_BACK } from './../../constants/index';
import { UserRoleType } from './../../feature/auth/enum/UserRoleType.enum';
import useAuthStore from './../../feature/auth/store/useAuthStore';
import LogoutCard from './../LogoutCard';
import { useOnClickOutside } from '@hooks/useOnClickOutside';
import FSAvatar from './../Avatar';
import { useProfileAvatar } from '@hooks/useProfileAvatar';
import { getEmployeeProfileImage } from '@/feature/employee/services';

const LayoutHeader = () => {
  const { getUserRole, getUserData } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);
  const LogoutRef = useRef<any>(null);
  const modalRef = useRef<any>(null);
  const { imageUrl } = useProfileAvatar();

  useOnClickOutside(LogoutRef, (event) => {
    if (!modalRef.current?.contains(event.target)) {
      setShowLogout(false);
    }
  });

  const [ProfileImage, setProfileImage] = useState('');
  const fetchData = async () => {
    try {
      const response = await getEmployeeProfileImage(getUserData().id);
      setProfileImage(response?.data?.image_url || '');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <header className="w-full py-4 xl:px-0 md:px-0 px-2 bg-white shadow-white">
      <div className="w-full h-full flex-around">
        <p className="w-[70%] xl:text-2xl text-md font-medium text-black ml-10 md:ml-0">
          {getUserRole() === UserRoleType.HR_ADMIN
            ? `${WELCOME_BACK} ${HR_TEAM}`
            : `${HELLO} ${getUserData()?.display_name}`}
        </p>
        <div className="w-[15%] flex gap-4 justify-end relative">
          <div className="relative">
            <FSAvatar
              src={ProfileImage ? ProfileImage : imageUrl ? imageUrl : ''}
              bgGradient={false}
              userName={getUserData()?.display_name}
              onClick={() => setShowLogout((prev) => !prev)}
            />
            {showLogout && (
              <div
                ref={LogoutRef}
                className="absolute xl:right-0 md:right-0 right-3 top-[58px] col z-10"
              >
                <LogoutCard dataFetch={() => {}} profileImage={ProfileImage} modalRef={modalRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader;
