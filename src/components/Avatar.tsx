import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useResourceProfilePic } from '@hooks/useResourceProfilePic';

type AvatarPropsType = {
  size?: number;
  className?: string;
  src?: string;
  userName?: string;
  style?: React.CSSProperties | undefined;
  onClick?: () => void;
  bgGradient?: boolean;
  azure_id?: string;
};

const FSAvatar = ({
  className,
  size = 40,
  src = '',
  userName = '',
  style,
  onClick,
  bgGradient = true,
  azure_id,
}: AvatarPropsType) => {
  const firstNameFirstLetter = userName?.charAt(0)?.toUpperCase();
  const secondNameFirstLetter = userName?.split(' ')?.[1]
    ? userName?.split(' ')?.[1]?.charAt(0)?.toUpperCase()
    : '';
  const resourcePic = useResourceProfilePic(azure_id || '');
  const imgsrc = azure_id ? resourcePic : '';
  const normalizeHash = (hash: number, min: number, max: number) => {
    return Math.floor((hash % (max - min)) + min);
  };

  // Function to generate HSL color from a string
  const getHashOfString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    // Get HSL values from the hash
    const h = normalizeHash(hash, 0, 360);
    const s = normalizeHash(hash, 50, 75);
    const l = normalizeHash(hash, 25, 75);

    return [h, s, l];
  };
  const [h, s, l] = getHashOfString(userName);
  const avatarColor = `hsl(${h}, ${s}%, ${l}%)`;

  return (
    <Avatar
      className={`${className} ${
        bgGradient ? 'gradient-profile-avatar' : ''
      } xl:w-[35px] w-[30px] xl:h-[35px] h-[30px] object-cover border-none hover:cursor-pointer !text-sm`}
      size={size}
      style={{ ...style, backgroundColor: avatarColor }}
      src={src ? <img src={src} alt="avatar" /> : imgsrc ? <img src={imgsrc} alt="avatar" /> : null}
      icon={userName ? null : <UserOutlined />}
      onClick={onClick}
    >
      {firstNameFirstLetter + secondNameFirstLetter}
    </Avatar>
  );
};

export default FSAvatar;
