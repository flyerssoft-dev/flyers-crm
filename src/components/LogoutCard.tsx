import React, { useState } from 'react';
import FSAvatar from './Avatar';
import { LogoutButton } from '@feature/auth/components';
import useAuthStore from '@feature/auth/store/useAuthStore';
import { CheckCircleTwoTone } from '@ant-design/icons';
// import putApi from '@feature/employee/api/putApi';
import { Button, Modal } from 'antd';
import { EditIcon } from '@assets/icons';
import { useProfileAvatar } from '@hooks/useProfileAvatar';
import { notify } from '@/utils/notify';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LogoutCard = ({ dataFetch, modalRef, profileImage }: any) => {
  const { getUserData } = useAuthStore();
  const { imageUrl } = useProfileAvatar();
  const roles = getUserData().Role || '';
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      notify.warning({
        description: 'Please select a file before saving.',
      });
      return;
    }

    setIsUploading(true);
    try {
      // await putApi.uploadImage('profile_image', selectedFile);
      setIsModalOpen(false);
      dataFetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="col gap-6 rounded-lg bg-white shadow-2xl p-5 px-2 lg:px-5 w-full">
      <div className="text-sm font-medium text-black">Flyers Soft Pvt.Ltd</div>
      <div className="flex items-center relative">
        <FSAvatar
          src={profileImage ? profileImage : imageUrl ? imageUrl : ''}
          bgGradient={false}
          className="flex-shrink-0 cursor-pointer w-2 h-2"
          userName={getUserData().display_name}
        />

        <div className="ml-3 flex">
          <div>
            <p className="font-bold text-black text-xs">{getUserData().display_name}</p>
            <p className="text-grayText font-normal xl:text-xs md:text-xs text-[8px]">
              {getUserData().email}
            </p>
          </div>
          <EditIcon onClick={showModal} className="h-4 w-4 cursor-pointer" />
        </div>
        <Modal
          title="Change your profile picture"
          open={isModalOpen}
          onOk={handleOk}
          centered
          onCancel={handleCancel}
          footer={
            <Button type="default" onClick={handleCancel}>
              Cancel
            </Button>
          }
        >
          <div
            ref={modalRef}
            className="flex flex-col gap-4 items-center justify-center h-full p-6"
          >
            <FSAvatar
              src={profileImage ? profileImage : imageUrl ? imageUrl : ''}
              userName={getUserData()?.display_name}
              style={{
                height: '150px',
                width: '150px',
              }}
              bgGradient={false}
            />

            <div className="flex-col justify-center items-center w-full text-center">
              <p className="font-medium text-violet mb-2">Upload Profile Picture</p>
              <div className="flex-center ml-24">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
              </div>
              {selectedFile ? (
                <Button
                  type="primary"
                  onClick={handleFileUpload} // Correctly assign the function here
                  loading={isUploading} // Optional: Show a loading spinner
                  className="mt-2"
                >
                  Upload
                </Button>
              ) : null}
            </div>
          </div>
        </Modal>
      </div>
      <hr className="border-0 h-[1px] bg-gradient-to-r from-gray to-mildWhite" />

      <div className="capitalize">
        <div
          className={`flex-between p-2 rounded-lg cursor-pointer 
            bg-purple-50
          `}
        >
          <div className="text-sm text-black">{String(roles).replace('_', ' ')}</div>

          <CheckCircleTwoTone twoToneColor="#29B95F" />
        </div>
      </div>
      <hr className="border-0 h-[1px] bg-gradient-to-r from-gray to-mildWhite" />
      <LogoutButton />
    </div>
  );
};

export default LogoutCard;
