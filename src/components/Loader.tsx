import { Spin } from 'antd';

interface LoaderProps {
  size?: 'small' | 'default' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ size = 'default' }) => {
  return (
    <div className="flex-center flex-col">
      <Spin size={size} />
    </div>
  );
};

export default Loader;
