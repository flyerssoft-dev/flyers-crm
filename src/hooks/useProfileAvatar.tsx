import useAuthStore from '@feature/auth/store/useAuthStore';
import { useEffect, useState } from 'react';

export const useProfileAvatar = () => {
  const [imageUrl, setImageUrl] = useState('');
  const { getUserProfileImage } = useAuthStore();
  useEffect(() => {
    const fetchData = async () => {
      const baseImage = await getUserProfileImage()?.data;
      if (baseImage) {
        const objectURL = `data:image/jpeg;base64,${baseImage}`;
        setImageUrl(objectURL);
      } else {
        setImageUrl('');
      }
    };
    fetchData();
  }, []);

  return { imageUrl, setImageUrl };
};
