import { ConfigProvider } from 'antd';
import { themeConfig } from '@/theme/themeconfig';

type AntdProviderProps = {
  children: React.ReactNode;
};

const AntdProvider = ({ children }: AntdProviderProps) => {
  return (
    <ConfigProvider theme={themeConfig} componentSize="middle">
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
