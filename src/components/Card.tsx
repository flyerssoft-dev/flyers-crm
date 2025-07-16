import { greenCard, purpleCard, yellowCard } from '@assets/images';
import { Card } from 'antd';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type CardTypeProps = {
  data?: string | ReactNode;
  label?: string;
  className?: string;
  dataClassName?: string;
  labelClassName?: string;
  type: 'purple' | 'green' | 'yellow';
  isAvatar?: boolean;
  Avatar?: React.ReactNode;
  navigateTo?: string;
};

const cardType = {
  purple: {
    img: `${purpleCard}`,
    dataColor: `text-purpleCard`,
    avatarBG: `bg-purpleCard`,
  },
  green: {
    img: `${greenCard}`,
    dataColor: 'text-greenCard',
    avatarBG: `bg-greenCard`,
  },
  yellow: {
    img: `${yellowCard}`,
    dataColor: 'text-yellowCard',
    avatarBG: `bg-yellowCard`,
  },
};

const FsCard = ({
  data,
  dataClassName,
  label,
  labelClassName,
  className,
  type,
  isAvatar,
  Avatar,
  navigateTo,
}: CardTypeProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };
  const cardStyle = {
    backgroundImage: `url(${cardType[type].img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <Card
      className={`${type} w-full flex bg-[purple-design] ${className} cursor-pointer`}
      style={cardStyle}
      onClick={handleClick}
    >
      <div className="row items-center gap-4 xl:gap-8">
        {isAvatar && Avatar}
        <div className="flex flex-col-reverse">
          <p className={` font-medium text-lg leading-5 ${labelClassName}`}>{label}</p>
          <h1 className={`font-bold text-2xl ${cardType[type].dataColor} ${dataClassName}`}>
            {data}
          </h1>
        </div>
      </div>
    </Card>
  );
};

export default FsCard;
