import React, { useState, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MENUS } from 'constants/app-constants';
import './sidebar.scss';

const { Sider } = Layout;

export const LogoComponent = ({ style = {}, collapsed = false }) => (
	<Link to="/" className="logo_class" style={{ color: '#000', ...style }}>
		{collapsed ? (
			<>
				Z<span style={{ color: '#006fd9' }}>B</span>
			</>
		) : (
			<>
				Zopay <span style={{ color: '#006fd9', paddingLeft: 5 }}>Books</span>
			</>
		)}
	</Link>
);

function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const { selectedKey, parentKey } = useMemo(() => {
		let selectedKey = '';
		let parentKey = '';

		MENUS.forEach((menu) => {
			if (menu.route && pathname.startsWith(menu.route)) {
				selectedKey = menu.key;
			}
			if (menu.submenus) {
				menu.submenus.forEach((submenu) => {
					if (submenu.route && pathname.startsWith(submenu.route)) {
						selectedKey = submenu.key;
						parentKey = menu.subName || menu.key;
					}
				});
			}
		});

		return { selectedKey, parentKey };
	}, [pathname]);

	const [openKeys, setOpenKeys] = useState(parentKey ? [parentKey] : []);

	const onOpenChange = (keys) => {
		const latestOpenKey = keys.find((key) => !openKeys.includes(key));
		setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
	};

	const menuItems = MENUS.map((menu) => {
		const Icon = menu.icon || <MailOutlined />;

		if (menu.submenus) {
			return {
				key: menu.subName || menu.key,
				icon: Icon,
				label: menu.name,
				children: menu.submenus.map((submenu) => ({
					key: submenu.key,
					label: submenu.name,
					onClick: () => navigate(submenu.route)
				}))
			};
		} else {
			return {
				key: menu.key,
				icon: Icon,
				label: menu.name,
				onClick: () => navigate(menu.route)
			};
		}
	});

	return (
		<Sider
			breakpoint="md"
			collapsible
			collapsedWidth={80}
			collapsed={collapsed}
			onCollapse={() => setCollapsed(!collapsed)}
			style={{ height: '100vh', overflow: 'auto' }}
		>
			<LogoComponent style={{ color: '#fff' }} collapsed={collapsed} />
			<Menu
				theme="light"
				mode="inline"
				selectedKeys={[selectedKey]}
				openKeys={openKeys}
				onOpenChange={onOpenChange}
				items={menuItems}
				style={{ height: 'calc(100% - 64px)', overflowY: 'auto', paddingBottom: 48 }}
			/>
		</Sider>
	);
}

export default Sidebar;
