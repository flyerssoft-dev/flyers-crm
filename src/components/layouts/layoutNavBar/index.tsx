/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { userPermissions } from '@feature/auth/utils/helper';
import useAuthStore from '@feature/auth/store/useAuthStore';
import { MenuData } from '@components/layouts/layoutNavBar/constants';
import { FeedbackNewIcon, FlyersLogo } from '@assets/icons';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

const { Sider, Header } = Layout;

export type MenuItem = { key: string; label: string; icon?: ReactNode; children?: MenuItem[] };

const LayoutNavBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [filteredMenu, setFilteredMenu] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserPermissions } = useAuthStore();

  useEffect(() => {
    const checkScreenSize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (!isNowMobile) {
        setCollapsed(false);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  // Filter menu items based on user permissions.
  useEffect(() => {
    const menuItems = MenuData()
      .map((menu: any) => {
        if (userPermissions(getUserPermissions(), menu)) {
          if (menu.children) {
            const children = menu.children
              .map((child: any) =>
                userPermissions(getUserPermissions(), child)
                  ? {
                      key: child.path,
                      label: child.title,
                      path: child.path,
                    }
                  : null,
              )
              .filter(Boolean);
            return {
              key: menu.path || menu.title,
              icon: menu.icon,
              label: menu.title,
              path: menu.path,
              children,
            };
          }
          return {
            key: menu.path,
            icon: menu.icon,
            label: menu.title,
            path: menu.path,
          };
        }
        return null;
      })
      .filter(Boolean);
    setFilteredMenu(menuItems);

    const activeMenu = menuItems.find((menu: any) =>
      menu.children?.some((child: any) => child.key === location.pathname),
    );
    if (activeMenu) {
      setOpenKeys([activeMenu.key]);
    }
  }, [getUserPermissions, location.pathname]);

  const handleMenuItemClick = (e: { key: string }) => {
    navigate(e.key);

    // Force close the sidebar in mobile view with a slight delay
    // to ensure navigation happens first
    if (isMobile) {
      setTimeout(() => {
        setCollapsed(true);
      }, 150);
    }
  };

  const handleOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="h-screen flex transition-all">
      {isMobile && (
        <div
          className="fixed top-7 left-4 z-50 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuOutlined className="text-lg" /> : <CloseOutlined className="text-lg" />}
        </div>
      )}
      <Sider
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        className={`fixed left-0 top-0 h-screen bg-white shadow-lg z-40 transition-transform ${
          isMobile ? (collapsed ? '-translate-x-full' : 'translate-x-0') : 'translate-x-0'
        }`}
        width={240}
        collapsedWidth={isMobile ? 0 : 80}
      >
        <div
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={toggleCollapsed}
        >
          <FlyersLogo fill="#7601C7" className="mx-auto" />
        </div>

        <div className="h-[calc(100%-220px)] overflow-auto scrollableWhite">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            style={{ color: '#7700c7' }}
            inlineCollapsed={collapsed}
          >
            {filteredMenu.map((menu: MenuItem) => {
              if (menu.children && menu.children.length) {
                // Check if the parent route is active.
                return (
                  <Menu.SubMenu key={menu.key} icon={menu.icon} title={<span>{menu.label}</span>}>
                    {menu.children.map((child: MenuItem) => (
                      <Menu.Item key={child.key} onClick={handleMenuItemClick}>
                        {child.label}
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                );
              }
              return (
                <Menu.Item key={menu.key} icon={menu.icon} onClick={handleMenuItemClick}>
                  {menu.label}
                </Menu.Item>
              );
            })}
          </Menu>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          {!collapsed ? (
            <div className="border p-4 rounded-lg z-50">
              <p className="text-center mb-3">
                <span className="text-sm text-gray-500">We Value Your Feedback!</span>
              </p>
              <Button
                type="primary"
                block
                onClick={() => window.open('https://forms.office.com/', '_blank')}
              >
                Feedback
              </Button>
            </div>
          ) : (
            <div
              onClick={() => window.open('https://forms.office.com/', '_blank')}
              className="mb-4 w-fit mx-auto hidden md:flex"
            >
              <div className="cursor-pointer">
                <FeedbackNewIcon fill="#000000" />
              </div>
            </div>
          )}
        </div>
      </Sider>

      {/* Main Content */}
      {/* TODO: find alternate solution instead of margins above 40  */}

      <Layout
        className={`transition-all ${
          isMobile ? 'ml-0' : collapsed ? 'ml-[0px]' : 'ml-[0px]'
        } w-full`}
      >
        <Header className="p-4 bg-white shadow-md flex justify-between items-center">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </Header>
      </Layout>
    </Layout>
  );
};

export default LayoutNavBar;
