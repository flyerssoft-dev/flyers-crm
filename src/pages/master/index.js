import React from 'react';
import { Row, Col, Tabs } from 'antd';
import { AppstoreOutlined, PartitionOutlined, DatabaseOutlined, CompressOutlined, BgColorsOutlined, FileTextOutlined, BookOutlined, CarOutlined } from '@ant-design/icons';

import Categories from 'pages/master-component/categories';
// import UnitList from 'pages/units/unit-list';
// import SizeList from 'pages/sizes/size-list';
import VoucherHead from 'pages/master-component/voucher-head/voucher-head';
import AccountBook from 'pages/master-component/acc-book';
import SubCategories from 'pages/master-component/sub-categories';
import ItemGroups from 'pages/master-component/item-groups';
import Vehicles from 'pages/master-component/vehicles';

const MASTER_TAB = [
	{
		label: (
			<span>
				<AppstoreOutlined style={{ marginRight: 6 }} />
				Categories
			</span>
		),
		key: 'categories',
		children: <Categories />,
	},
	{
		label: (
			<span>
				<PartitionOutlined style={{ marginRight: 6 }} />
				Sub Categories
			</span>
		),
		key: 'sub-categories',
		children: <SubCategories />,
	},
	{
		label: (
			<span>
				<DatabaseOutlined style={{ marginRight: 6 }} />
				Item Groups
			</span>
		),
		key: 'item-groups',
		children: <ItemGroups />,
	},
	{
		label: (
			<span>
				<CarOutlined style={{ marginRight: 6 }} />
				Vehicles
			</span>
		),
		key: 'vehicles',
		children: <Vehicles />,
	},
	// {
	// 	label: (
	// 		<span>
	// 			<CompressOutlined style={{ marginRight: 6 }} />
	// 			Sizes
	// 		</span>
	// 	),
	// 	key: 'sizes',
	// 	children: <SizeList />,
	// },
	// {
	// 	label: (
	// 		<span>
	// 			<BgColorsOutlined style={{ marginRight: 6 }} />
	// 			Units
	// 		</span>
	// 	),
	// 	key: 'units',
	// 	children: <UnitList />,
	// },
	// {
	// 	label: (
	// 		<span>
	// 			<FileTextOutlined style={{ marginRight: 6 }} />
	// 			Voucher Heads
	// 		</span>
	// 	),
	// 	key: 'voucher-heads',
	// 	children: <VoucherHead />,
	// },
	{
		label: (
			<span>
				<BookOutlined style={{ marginRight: 6 }} />
				Account Books
			</span>
		),
		key: 'account-books',
		children: <AccountBook />,
	},
];

const Master = () => (
	<Row style={{ padding: '20px 10px' }}>
		<Col xl={24}>
			<Tabs defaultActiveKey="categories" destroyInactiveTabPane items={MASTER_TAB} />
		</Col>
	</Row>
);

export default Master;
