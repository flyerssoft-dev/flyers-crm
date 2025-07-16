import React, { useState, useEffect } from 'react';
import { Tabs, Typography, Skeleton } from 'antd';
import Transactions from './transactions';
import Overview, { OverviewLoader } from './overview';
import MailList from './mails';

const { Text } = Typography;

const CustomerDetails = ({ selectedCustomer }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulating data fetch delay
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	}, [selectedCustomer]);

	const items = [
		{
			label: 'Overview',
			key: 'overview',
			children: loading ? <OverviewLoader /> : <Overview customerDetails={selectedCustomer} />,
		},
		{
			label: 'Transactions',
			key: 'transactions',
			children: loading ? <Skeleton active loading={loading} paragraph={{ rows: 2 }} /> : <Transactions />,
		},
		{
			label: 'Comments',
			key: 'comments',
			children: loading ? <Skeleton active loading={loading} paragraph={{ rows: 2 }} /> : <Text>No comments available</Text>,
		},
		{
			label: 'Mails',
			key: 'mails',
			children: loading ? <Skeleton active loading={loading} paragraph={{ rows: 2 }} /> : <MailList />,
		},
		{
			label: 'Statement',
			key: 'statement',
			children: loading ? <Skeleton active loading={loading} paragraph={{ rows: 2 }} /> : <Text>No statements available</Text>,
		},
	];

	return <Tabs defaultActiveKey="overview" items={items} />;
};

export default CustomerDetails;
