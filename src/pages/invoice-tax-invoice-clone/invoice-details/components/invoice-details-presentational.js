import React from 'react';
import { Col, Divider, Row, Tabs } from 'antd';
import Overview from './overview';
import Images from './images';
import Sales from './sales';
import Summary from './summary';

const { TabPane } = Tabs;

const DATE_SOURCE = [
	{
		key: '1',
		date: '10-11-2022',
		invoice: 'INV-001',
		orderNumber: 'ORD-001',
		customerName: 'John Doe',
		status: 'Overdue by 1 day',
		dueDate: '10-11-2022',
		amount: '100.00',
		balanceDue: '10.00',
	},
	{
		key: '2',
		date: '10-11-2022',
		invoice: 'INV-002',
		orderNumber: 'ORD-001',
		customerName: 'Sathish Saminathan',
		status: 'Paid',
		dueDate: '10-11-2022',
		amount: '100.00',
		balanceDue: '10.00',
	},
];

const MASTER_TAB = [
	{
		tabName: 'Overview',
		component: Overview,
	},
	{
		tabName: 'Images',
		component: Images,
	},
	{
		tabName: 'Sales',
		component: Sales,
	},
	{
		tabName: 'Summary',
		component: Summary,
	},
];

const InvoiceDetailsPresentational = () => {
	return (
		<Row className="invoice_details_container">
			<Col xl={24}>
				<Row style={{ padding: 0 }} className="invoice">
					<Col span={6} className="invoice_list_container">
						{Array(100)
							.fill(DATE_SOURCE[0])
							?.map((data, index) => (
								<Row
									// onClick={() => setSelectedInvoice(data)}
									key={index}
									className={`invoice_list`}>
									{/* className={`invoice_list ${selectedInvoice?.invoice === data?.invoice ? 'selected' : ''}`}> */}
									<Col span={24}>
										<Row justify="space-between">
											<Col className="">{data?.customerName || ''}</Col>
											<Col className="">{data?.amount || ''}</Col>
										</Row>
									</Col>
									<Col span={24}>
										<Row align="middle" justify="space-between">
											<Col>
												<Row>
													<Col className="">
														<a href="/invoice">{data?.invoice || ''}</a>
													</Col>
													<Divider type="vertical" />
													<Col className="">{data?.amount || ''}</Col>
												</Row>
											</Col>
											<Col>{data?.status || ''}</Col>
										</Row>
									</Col>
								</Row>
							))}
					</Col>
					<Col span={18} className="invoice_viewer">
						<Tabs defaultActiveKey="0">
							{MASTER_TAB.map(({ tabName, component }, index) => {
								const Component = component;
								return (
									<TabPane tab={tabName} key={index}>
										<Component />
									</TabPane>
								);
							})}
						</Tabs>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default InvoiceDetailsPresentational;
