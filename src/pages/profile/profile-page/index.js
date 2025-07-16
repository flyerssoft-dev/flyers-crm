import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import CompanyInformation from './company-info';
import Configuration from './configuration';
import BankDetails from './bank-details';
import SignPage from './sign-page';
import './style.scss';

const ProfilePage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const items = [
		{
			key: 'company-info',
			label: 'Company Information',
			children: <CompanyInformation />,
		},
		{
			key: 'bank-details',
			label: 'Bank Details',
			children: <BankDetails />,
		},
		{
			key: 'sign',
			label: 'Sign',
			children: <SignPage />,
		},
		{
			key: 'configuration',
			label: 'Configuration',
			children: <Configuration />,
		},
	];

	const getValidatedTabKey = () => {
		const tab = new URLSearchParams(location.search).get('tab');
		const validKeys = items.map(item => item.key);
		return validKeys.includes(tab) ? tab : items[0].key; // default to first tab
	};

	const [activeKey, setActiveKey] = useState(getValidatedTabKey());

	useEffect(() => {
		setActiveKey(getValidatedTabKey());
	}, [location.search]);

	const handleTabChange = (key) => {
		setActiveKey(key);
		navigate(`?tab=${key}`, { replace: true });
	};

	return (
		<div style={{ padding: 24 }}>
			<Tabs activeKey={activeKey} onChange={handleTabChange} items={items} />
		</div>
	);
};

export default ProfilePage;
