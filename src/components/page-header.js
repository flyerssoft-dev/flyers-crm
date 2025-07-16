import React, { useState } from 'react';
import { PageHeader as AntHeader } from '@ant-design/pro-layout';
import { Menu, Dropdown, Drawer, Avatar, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, MailOutlined } from '@ant-design/icons';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { getFirstLetterFromWords } from 'helpers';
import { SIDE_MENUS } from 'constants/app-constants';
import { sendGetRequest } from 'redux/sagas/utils';
import { SERVER_IP } from 'assets/Config';
import { setSelectedOrganization } from '../redux/reducers/globals/globalActions';
import { applicationLogout } from '../services/LoginServices';
import InfiniteLoader from 'components/infinite-loader';
import Swal from 'sweetalert2';
// import './drawer.scss';
import './page-header.scss';

const PageHeader = () => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const loginRedux = useSelector((state) => state.loginRedux);
	const [open, setOpen] = useState(false);
	const [placement] = useState('right');
	const [isSwitchingOrg, setIsSwitchingOrg] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const showDrawer = () => setOpen(true);
	const onClose = () => setOpen(false);

	const selectOrganization = async (org) => {
		try {
			setIsSwitchingOrg(true);
			const response = await sendGetRequest(null, `${SERVER_IP}organization/${org._id}`);
			dispatch(setSelectedOrganization(response?.data));

			if (response?.data) {
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			}
		} catch (error) {
			console.error('Error selecting organization:', error);
			setIsSwitchingOrg(false);
		}
	};

	const handleLogout = async () => {
		const result = await Swal.fire({
			title: '<h3 style="font-weight:600;color:#333;margin-bottom:8px">Logout Confirmation</h3>',
			html: '<p style="color:#777;font-size:14px;margin:0">Are you sure you want to logout?</p>',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#2562ec',
			cancelButtonColor: '#f0f0f0',
			confirmButtonText: 'Logout',
			cancelButtonText: 'Cancel',
			reverseButtons: true,
			buttonsStyling: false,
			customClass: {
				popup: 'logout-popup',
				confirmButton: 'logout-confirm',
				cancelButton: 'logout-cancel',
			},
		});

		if (result.isConfirmed) {
			applicationLogout();
			dispatch(setSelectedOrganization(null));
		}
	};

	const organizationMenu = {
		items: globalRedux?.organizations?.map((org, index) => ({
			key: org?._id || `org-${index}`,
			label: org?.orgName,
			onClick: () => {
				selectOrganization(org);
			},
		})),
	};

	if (!loginRedux.isLogged) return null;

	return (
		<>
			<AntHeader
				title={<div className="d-flex">{/* Optional Logo */}</div>}
				style={{ backgroundColor: '#fff' }}
				extra={[
					<Dropdown menu={organizationMenu} trigger={['click']} key="org-dropdown">
						<button
							style={{
								color: 'black',
								marginRight: '10px',
								backgroundColor: '#fff',
								border: 'none',
							}}
							onClick={(e) => e.preventDefault()}>
							{globalRedux?.selectedOrganization?.orgName} <DownOutlined />
						</button>
					</Dropdown>,
					<div onClick={showDrawer} key="avatar">
						<Avatar className="pointer-icons" style={{ verticalAlign: 'middle', backgroundColor: '#006fd9' }} size="default">
							{getFirstLetterFromWords(`${loginRedux?.firstName} ${loginRedux?.lastName}`)}
						</Avatar>
					</div>,
				]}
			/>

			<Drawer
				rootClassName="app-drawer"
				title={
					<div className="title-area">
						<div className="AppHeader-logo position-relative">
							<Avatar size="default" style={{ verticalAlign: 'middle', backgroundColor: '#006fd9' }}>
								{getFirstLetterFromWords(`${loginRedux?.firstName} ${loginRedux?.lastName}`)}
							</Avatar>
						</div>
						<div className="name_role">
							<div className="name">
								{loginRedux?.firstName} {loginRedux?.lastName}
							</div>
							<div className="role">{loginRedux?.mobile}</div>
						</div>
					</div>
				}
				placement={placement}
				width="20%"
				onClose={onClose}
				open={open}
				key={placement}>
				<div className="drawer-container">
					<Menu theme="light" mode="inline">
						<Menu.Item
							key="profile"
							icon={<FiUser />}
							onClick={() => {
								onClose();
								navigate('/profile');
							}}>
							Profile
						</Menu.Item>

						<Divider />

						{SIDE_MENUS.map((menu, index) => {
							const Icon = menu?.icon || <MailOutlined />;
							return (
								<Menu.Item
									key={menu?.key || `side-${index}`}
									icon={Icon}
									onClick={() => {
										onClose();
										menu?.route && navigate(menu.route);
									}}>
									{menu.name}
								</Menu.Item>
							);
						})}

						<Divider />

						<Menu.Item className="logout-button" key="logout" icon={<FiLogOut />} onClick={handleLogout}>
							Logout
						</Menu.Item>
					</Menu>
				</div>
			</Drawer>

			{isSwitchingOrg && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						backgroundColor: 'rgba(255,255,255,0.85)',
						zIndex: 2000,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
					}}>
					<InfiniteLoader />
					<div style={{ marginTop: 20, fontSize: 16, fontWeight: 500, color: '#333' }}>Switching organization...</div>
				</div>
			)}
		</>
	);
};

export default PageHeader;
