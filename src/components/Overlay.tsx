import { useEffect } from 'react';
import { Drawer } from 'antd';
import { CloseIcon } from '@assets/icons/index';
import Loader from './Loader';

type OverlayPropTypes = {
  children: React.ReactNode;
  className?: string;
  width?: number;
  isOpen?: boolean;
  visible?: boolean;
  placement?: any;
  extra?: any;
  style?: any;
  onClose: () => void;
  loading?: boolean;
  size?: 'default' | 'large' | undefined;
  title?: string; // added title prop
  description?: string; // added description prop
  titleIcon?: React.ReactNode; // added titleIcon prop
};

const FsOverlay = ({
  children,
  className,
  width,
  isOpen,
  placement,
  extra,
  style,
  onClose,
  loading = false,
  size,
  title, // destructured title
  description, // added description prop
  titleIcon, // added titleIcon prop
}: OverlayPropTypes) => {
  // const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top when drawer is opened
  useEffect(() => {
    if (isOpen) {
      // Delay to allow Drawer content to mount
      setTimeout(() => {
        const drawerContent = document.querySelector('.ant-drawer-body');
        if (drawerContent) {
          drawerContent.scrollTop = 0;
        }
      }, 50);
    }
  }, [isOpen]);

  return (
    <>
      <Drawer
        width={width}
        title={
          <div className="flex items-start justify-between pl-4 pr-2">
            <div>
              <div className="text-base font-semibold">{title ? `${title}` : 'Close'}</div>
              {description && (
                <div className="text-sm text-[#7c7c7c] font-medium mt-1">{description}</div>
              )}
            </div>
            {titleIcon && <div className="ml-2">{titleIcon}</div>}
          </div>
        }
        onClose={onClose}
        closeIcon={<CloseIcon />}
        open={isOpen}
        placement={placement}
        className={`${className} cursor-pointer`}
        extra={extra}
        style={style}
        size={size}
      >
        {loading ? <Loader /> : children}
      </Drawer>
    </>
  );
};

export default FsOverlay;
