import { Button } from 'antd';
import { JSX } from 'react';

type Props = {
  text?: string;
  className?: string;
  textClassName?: string;
  onClick?: (e: any) => void;
  type?: 'text' | 'link' | 'default' | 'primary' | 'dashed' | undefined;
  isIcon?: boolean;
  icon?: JSX.Element;
  href?: string;
  iconPosition?: 'end' | 'start';
  htmlType?: 'submit' | 'reset' | 'button' | undefined;
  loading?: boolean;
  disabled?: boolean;
};

const FsButton = ({
  text,
  className,
  onClick,
  icon,
  textClassName,
  type,
  isIcon,
  href,
  iconPosition,
  htmlType,
  loading,
  disabled,
}: Props) => {
  return (
    <>
      <Button
        type={type}
        icon={isIcon ? icon : ''}
        iconPosition={iconPosition}
        onClick={onClick}
        className={` ${className}`}
        href={href}
        htmlType={htmlType}
        loading={loading}
        disabled={disabled}
      >
        <p className={`${textClassName}`}>{text}</p>
      </Button>
    </>
  );
};

export default FsButton;
