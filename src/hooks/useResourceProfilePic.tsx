import { getProfilePicture } from '@/feature/employee/services';
import { useEffect, useState } from 'react';

export const useResourceProfilePic = (azure_id: string) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseImage = await getProfilePicture(azure_id);

        if (baseImage?.data) {
          const objectURL = `data:image/jpeg;base64,${baseImage.data}`;
          setImageUrl(objectURL);
        } else {
          setImageUrl('');
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return imageUrl;
};
