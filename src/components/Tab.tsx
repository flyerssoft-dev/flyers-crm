import { Tabs, TabsProps } from 'antd';

type TabPropsType = {
  items: TabsProps['items'];
  onChange: ((activeKey: string) => void) | undefined;
  className?: string;
  activeKey?: string | undefined;
};

const FsTab = ({ items, onChange, className, activeKey }: TabPropsType) => (
  <Tabs
    defaultActiveKey="1"
    items={items}
    onChange={onChange}
    activeKey={activeKey}
    className={`${className} custom-tab-bar`}
  />
);

export default FsTab;
